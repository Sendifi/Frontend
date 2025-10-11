import { Shipment } from '../model/Shipment.js'

export class ShipmentDomainService {
  static calculateCost(weight, courier) {
    if (!courier?.costPerKg) return 0
    return Number((weight || 0) * courier.costPerKg)
  }

  static create({ payload, courier }) {
    const shipment = new Shipment({
      ...payload,
      cost: payload.cost ?? ShipmentDomainService.calculateCost(payload.weight, courier),
    })
    if (!shipment.isValid()) {
      throw new Error('Shipment is not valid')
    }
    return shipment
  }
}
