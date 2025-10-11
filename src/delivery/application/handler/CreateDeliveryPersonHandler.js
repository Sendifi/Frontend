import { DeliveryDomainService } from '../../domain/service/DeliveryDomainService.js'

export class CreateDeliveryPersonHandler {
  constructor({ deliveryPersonRepository }) {
    this.deliveryPersonRepository = deliveryPersonRepository
  }

  async execute(command) {
    const deliveryPerson = DeliveryDomainService.create(command.payload)
    return this.deliveryPersonRepository.create(deliveryPerson)
  }
}
