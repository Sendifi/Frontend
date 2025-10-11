export class AssignDeliveryPersonCommand {
  constructor({ shipmentId, deliveryPersonId }) {
    this.shipmentId = shipmentId
    this.deliveryPersonId = deliveryPersonId
  }
}
