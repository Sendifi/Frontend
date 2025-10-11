import { ShipmentRepository } from '../../domain/repository/ShipmentRepository.js'
import { ShipmentAssembler } from '../assembler/ShipmentAssembler.js'
import { ShippingApi } from '../api/ShippingApi.js'

export class ShippingRepositoryImpl extends ShipmentRepository {
  async findAll(filters = {}) {
    const data = await ShippingApi.getAll(filters)
    return ShipmentAssembler.toDomainCollection(data)
  }

  async findById(id) {
    const data = await ShippingApi.getById(id)
    return ShipmentAssembler.toDomain(data)
  }

  async findByTrackingCode(code) {
    const data = await ShippingApi.getByTrackingCode(code)
    return ShipmentAssembler.toDomain(data)
  }

  async create(shipment) {
    const payload = ShipmentAssembler.toDTO(shipment)
    const data = await ShippingApi.create(payload)
    return ShipmentAssembler.toDomain(data)
  }

  async updateStatus(shipmentId, status) {
    const data = await ShippingApi.update(shipmentId, {
      status,
      updatedAt: new Date().toISOString(),
    })
    return ShipmentAssembler.toDomain(data)
  }

  async assignDeliveryPerson(shipmentId, deliveryPersonId) {
    const data = await ShippingApi.update(shipmentId, {
      deliveryPersonId,
      updatedAt: new Date().toISOString(),
    })
    return ShipmentAssembler.toDomain(data)
  }

  async remove(shipmentId) {
    return ShippingApi.delete(shipmentId)
  }
}
