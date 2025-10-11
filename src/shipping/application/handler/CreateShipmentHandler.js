import { ShipmentDomainService } from '../../domain/service/ShipmentDomainService.js'

export class CreateShipmentHandler {
  constructor({ shipmentRepository, courierRepository }) {
    this.shipmentRepository = shipmentRepository
    this.courierRepository = courierRepository
  }

  async execute(command) {
    const courier = command.payload?.courierId
      ? await this.courierRepository.findById(command.payload.courierId)
      : null
    const shipment = ShipmentDomainService.create({
      payload: command.payload,
      courier,
    })
    return this.shipmentRepository.create(shipment)
  }
}
