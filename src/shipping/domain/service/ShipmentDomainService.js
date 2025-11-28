import { Shipment } from '../model/Shipment.js'

export class ShipmentDomainService {
  static calculateCost(weight, courier) {
    if (!courier?.costPerKg) return 0
    const base = courier.baseCost || 0
    return Number(base + (weight || 0) * courier.costPerKg)
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
