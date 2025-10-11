export class GetShipmentsHandler {
  constructor({ shipmentRepository }) {
    this.shipmentRepository = shipmentRepository
  }

  async execute(query) {
    return this.shipmentRepository.findAll(query.filters)
  }
}
