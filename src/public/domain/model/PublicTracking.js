import { TRACKING_STATUS_PROGRESS } from '../../../core/constants/domainConstants.js'

export class PublicTracking {
  constructor({ shipment, events = [] }) {
    this.shipment = shipment
    this.events = events
  }

  get progress() {
    const latestStatus = this.events.at(-1)?.status || this.shipment?.status
    return TRACKING_STATUS_PROGRESS[latestStatus] ?? 0
  }

  get currentStatusDescription() {
    return this.events.at(-1)?.description ?? null
  }
}
