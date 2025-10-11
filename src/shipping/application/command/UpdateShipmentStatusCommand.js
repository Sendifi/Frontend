export class UpdateShipmentStatusCommand {
  constructor({ shipmentId, status }) {
    this.shipmentId = shipmentId
    this.status = status
  }
}
