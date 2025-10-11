import { defineStore } from 'pinia'
import { SHIPMENT_STATUS } from '../../core/constants/domainConstants.js'
import { ShippingRepositoryImpl } from '../infrastructure/repository/ShippingRepositoryImpl.js'
import { CourierRepositoryImpl } from '../../pricing/infrastructure/repository/CourierRepositoryImpl.js'
import { GetShipmentsQuery } from './query/GetShipmentsQuery.js'
import { GetShipmentsHandler } from './handler/GetShipmentsHandler.js'
import { GetShipmentByIdQuery } from './query/GetShipmentByIdQuery.js'
import { GetShipmentByIdHandler } from './handler/GetShipmentByIdHandler.js'
import { CreateShipmentCommand } from './command/CreateShipmentCommand.js'
import { CreateShipmentHandler } from './handler/CreateShipmentHandler.js'
import { UpdateShipmentStatusCommand } from './command/UpdateShipmentStatusCommand.js'
import { UpdateShipmentStatusHandler } from './handler/UpdateShipmentStatusHandler.js'
import { AssignDeliveryPersonCommand } from './command/AssignDeliveryPersonCommand.js'
import { AssignDeliveryPersonHandler } from './handler/AssignDeliveryPersonHandler.js'
import { ConfirmDeliveryCommand } from './command/ConfirmDeliveryCommand.js'
import { ConfirmDeliveryHandler } from './handler/ConfirmDeliveryHandler.js'

const shipmentRepository = new ShippingRepositoryImpl()
const courierRepository = new CourierRepositoryImpl()

export const useShippingStore = defineStore('shipping', {
  state: () => ({
    shipments: [],
    stats: {
      total: 0,
      inTransit: 0,
      delivered: 0,
      pending: 0,
    },
    couriers: [],
    loading: false,
    error: null,
    filters: {
      status: null,
      deliveryPersonId: null,
    },
    selectedShipment: null,
  }),
  getters: {
    hasShipments: (state) => state.shipments.length > 0,
  },
  actions: {
    async fetchShipments(filters = {}) {
      this.loading = true
      this.error = null
      try {
        const handler = new GetShipmentsHandler({ shipmentRepository })
        const shipments = await handler.execute(new GetShipmentsQuery({ ...this.filters, ...filters }))
        this.shipments = shipments
        this.computeStats()
      } catch (error) {
        this.error = error.message || 'errors.fetchShipments'
      } finally {
        this.loading = false
      }
    },
    async fetchShipmentById(shipmentId) {
      this.loading = true
      this.error = null
      try {
        const handler = new GetShipmentByIdHandler({ shipmentRepository })
        const shipment = await handler.execute(new GetShipmentByIdQuery({ shipmentId }))
        this.selectedShipment = shipment
        const exists = this.shipments.some((item) => item.id === shipment.id)
        if (!exists) {
          this.shipments.push(shipment)
          this.computeStats()
        }
        return shipment
      } catch (error) {
        this.error = error.message || 'errors.fetchShipmentDetail'
        throw error
      } finally {
        this.loading = false
      }
    },
    async loadCouriers() {
      try {
        this.couriers = await courierRepository.findAll()
      } catch (error) {
        this.error = error.message || 'errors.fetchCouriers'
      }
    },
    async createShipment(payload) {
      this.loading = true
      this.error = null
      try {
        const handler = new CreateShipmentHandler({ shipmentRepository, courierRepository })
        const created = await handler.execute(new CreateShipmentCommand(payload))
        this.shipments.unshift(created)
        this.computeStats()
        return created
      } catch (error) {
        this.error = error.message || 'errors.createShipment'
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateShipmentStatus({ shipmentId, status }) {
      const handler = new UpdateShipmentStatusHandler({ shipmentRepository })
      const updated = await handler.execute(new UpdateShipmentStatusCommand({ shipmentId, status }))
      this.shipments = this.shipments.map((shipment) => (shipment.id === updated.id ? updated : shipment))
      this.computeStats()
      return updated
    },
    async assignDeliveryPerson({ shipmentId, deliveryPersonId }) {
      const handler = new AssignDeliveryPersonHandler({ shipmentRepository })
      const updated = await handler.execute(
        new AssignDeliveryPersonCommand({ shipmentId, deliveryPersonId }),
      )
      this.shipments = this.shipments.map((shipment) => (shipment.id === updated.id ? updated : shipment))
      return updated
    },
    async confirmDelivery(shipmentId) {
      const handler = new ConfirmDeliveryHandler({ shipmentRepository })
      const updated = await handler.execute(new ConfirmDeliveryCommand({ shipmentId }))
      this.shipments = this.shipments.map((shipment) => (shipment.id === updated.id ? updated : shipment))
      this.computeStats()
      return updated
    },
    async deleteShipment(shipmentId) {
      await shipmentRepository.remove(shipmentId)
      this.shipments = this.shipments.filter((shipment) => shipment.id !== shipmentId)
      this.computeStats()
    },
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    computeStats() {
      const total = this.shipments.length
      const delivered = this.shipments.filter((shipment) => shipment.status === SHIPMENT_STATUS.DELIVERED).length
      const inTransit = this.shipments.filter((shipment) => shipment.status === SHIPMENT_STATUS.IN_TRANSIT).length
      const pending = this.shipments.filter((shipment) => shipment.status === SHIPMENT_STATUS.PENDING).length
      this.stats = {
        total,
        delivered,
        inTransit,
        pending,
      }
    },
  },
})
