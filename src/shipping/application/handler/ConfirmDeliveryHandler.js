import { SHIPMENT_STATUS } from '../../../core/constants/domainConstants.js'

export class ConfirmDeliveryHandler {
  constructor({ shipmentRepository }) {
    this.shipmentRepository = shipmentRepository
  }

  async execute(command) {
    return this.shipmentRepository.updateStatus(command.shipmentId, SHIPMENT_STATUS.DELIVERED)
  }
}
