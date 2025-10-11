export class AssignDeliveryPersonHandler {
  constructor({ shipmentRepository }) {
    this.shipmentRepository = shipmentRepository
  }

  async execute(command) {
    return this.shipmentRepository.assignDeliveryPerson(command.shipmentId, command.deliveryPersonId)
  }
}
