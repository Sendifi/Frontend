import { PublicTracking } from '../../domain/model/PublicTracking.js'

export class GetTrackingByCodeHandler {
  constructor({ shipmentRepository, trackingRepository }) {
    this.shipmentRepository = shipmentRepository
    this.trackingRepository = trackingRepository
  }

  async execute(query) {
    const shipment = await this.shipmentRepository.findByTrackingCode(query.trackingCode)
    if (!shipment) {
      throw new Error('errors.trackingNotFound')
    }
    const events = await this.trackingRepository.findByShipmentId(shipment.id)
    return new PublicTracking({ shipment, events })
  }
}
