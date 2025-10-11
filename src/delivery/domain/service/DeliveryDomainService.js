import { DeliveryPerson } from '../model/DeliveryPerson.js'

export class DeliveryDomainService {
  static create(payload) {
    const deliveryPerson = new DeliveryPerson(payload)
    if (!deliveryPerson.code) {
      deliveryPerson.code = deliveryPerson.generateCode()
    }
    return deliveryPerson
  }
}
