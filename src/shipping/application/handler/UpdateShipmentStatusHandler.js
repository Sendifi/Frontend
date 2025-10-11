export class UpdateShipmentStatusHandler {
  constructor({ shipmentRepository }) {
    this.shipmentRepository = shipmentRepository
  }

  async execute(command) {
    return this.shipmentRepository.updateStatus(command.shipmentId, command.status)
  }
}
