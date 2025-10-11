export class GetDeliveryPersonByCodeHandler {
  constructor({ deliveryPersonRepository }) {
    this.deliveryPersonRepository = deliveryPersonRepository
  }

  async execute(query) {
    return this.deliveryPersonRepository.findByCode(query.code)
  }
}
