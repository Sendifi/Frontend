import { defineStore } from 'pinia'
import { DeliveryPersonRepositoryImpl } from '../infrastructure/repository/DeliveryPersonRepositoryImpl.js'
import { ShippingRepositoryImpl } from '../../shipping/infrastructure/repository/ShippingRepositoryImpl.js'
import { CreateDeliveryPersonHandler } from './handler/CreateDeliveryPersonHandler.js'
import { CreateDeliveryPersonCommand } from './command/CreateDeliveryPersonCommand.js'
import { GetDeliveryPersonsHandler } from './handler/GetDeliveryPersonsHandler.js'
import { GetDeliveryPersonByCodeHandler } from './handler/GetDeliveryPersonByCodeHandler.js'
import { GetDeliveryPersonByCodeQuery } from './query/GetDeliveryPersonByCodeQuery.js'
import { UpdateShipmentStatusHandler } from '../../shipping/application/handler/UpdateShipmentStatusHandler.js'
import { UpdateShipmentStatusCommand } from '../../shipping/application/command/UpdateShipmentStatusCommand.js'
import { SHIPMENT_STATUS } from '../../core/constants/domainConstants.js'

const deliveryPersonRepository = new DeliveryPersonRepositoryImpl()
const shippingRepository = new ShippingRepositoryImpl()
const updateStatusHandler = new UpdateShipmentStatusHandler({ shipmentRepository: shippingRepository })

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    deliveryPersons: [],
    assignedShipments: [],
    currentDeliveryPerson: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchDeliveryPersons() {
      this.loading = true
      this.error = null
      try {
        const handler = new GetDeliveryPersonsHandler({ deliveryPersonRepository })
        this.deliveryPersons = await handler.execute()
      } catch (error) {
        this.error = error.message || 'errors.fetchDeliveryPersons'
      } finally {
        this.loading = false
      }
    },
    async createDeliveryPerson(payload) {
      this.loading = true
      this.error = null
      try {
        const handler = new CreateDeliveryPersonHandler({ deliveryPersonRepository })
        const created = await handler.execute(new CreateDeliveryPersonCommand(payload))
        this.deliveryPersons.push(created)
        return created
      } catch (error) {
        this.error = error.message || 'errors.createDeliveryPerson'
        throw error
      } finally {
        this.loading = false
      }
    },
    async deleteDeliveryPerson(id) {
      try {
        await deliveryPersonRepository.delete(id)
        this.deliveryPersons = this.deliveryPersons.filter((person) => person.id !== id)
      } catch (error) {
        this.error = error.message || 'errors.deleteDeliveryPerson'
        throw error
      }
    },
    async getDeliveryPersonByCode(code) {
      this.loading = true
      this.error = null
      try {
        const handler = new GetDeliveryPersonByCodeHandler({ deliveryPersonRepository })
        this.currentDeliveryPerson = await handler.execute(new GetDeliveryPersonByCodeQuery({ code }))
        return this.currentDeliveryPerson
      } catch (error) {
        this.error = error.message || 'errors.invalidCourierCode'
        this.currentDeliveryPerson = null
        throw error
      } finally {
        this.loading = false
      }
    },
    async getAssignedShipments(deliveryPersonId) {
      this.loading = true
      this.error = null
      try {
        this.assignedShipments = await shippingRepository.findAll({ deliveryPersonId })
      } catch (error) {
        this.error = error.message || 'errors.fetchAssignedShipments'
        this.assignedShipments = []
      } finally {
        this.loading = false
      }
    },
    async updateShipmentStatus({ shipmentId, status }) {
      return updateStatusHandler.execute(new UpdateShipmentStatusCommand({ shipmentId, status }))
    },
    async markDelivered(shipmentId) {
      return this.updateShipmentStatus({ shipmentId, status: SHIPMENT_STATUS.DELIVERED })
    },
    async confirmDelivery(shipmentId) {
      return this.markDelivered(shipmentId)
    },
    async addShipmentToDeliveryPerson({ deliveryPersonId, shipmentId }) {
      const deliveryPerson = await deliveryPersonRepository.findById(deliveryPersonId)
      if (!deliveryPerson) return
      const assignedSet = new Set(deliveryPerson.assignedShipments)
      assignedSet.add(shipmentId)
      const updated = await deliveryPersonRepository.update(deliveryPersonId, {
        assignedShipments: Array.from(assignedSet),
      })
      this.deliveryPersons = this.deliveryPersons.map((person) =>
        person.id === deliveryPersonId ? updated : person,
      )
    },
  },
})
