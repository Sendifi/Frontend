export class GetDeliveryPersonsHandler {
  constructor({ deliveryPersonRepository }) {
    this.deliveryPersonRepository = deliveryPersonRepository
  }

  async execute() {
    return this.deliveryPersonRepository.findAll()
  }
}
