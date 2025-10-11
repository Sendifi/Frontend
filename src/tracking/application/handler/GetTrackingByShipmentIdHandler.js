import { TrackingDomainService } from '../../domain/service/TrackingDomainService.js'

export class GetTrackingByShipmentIdHandler {
  constructor({ trackingRepository }) {
    this.trackingRepository = trackingRepository
  }

  async execute(query) {
    const events = await this.trackingRepository.findByShipmentId(query.shipmentId)
    return TrackingDomainService.buildTimeline(events)
  }
}
