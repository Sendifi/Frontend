export class GetShipmentByIdHandler {
  constructor({ shipmentRepository }) {
    this.shipmentRepository = shipmentRepository
  }

  async execute(query) {
    return this.shipmentRepository.findById(query.shipmentId)
  }
}
