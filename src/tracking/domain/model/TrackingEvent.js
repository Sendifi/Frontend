import { SHIPMENT_STATUS } from '../../../core/constants/domainConstants.js'

export class TrackingEvent {
  constructor({
    id,
    shipmentId,
    status = SHIPMENT_STATUS.REGISTERED,
    description,
    location,
    timestamp = new Date().toISOString(),
    courierReference = null,
  }) {
    this.id = id
    this.shipmentId = shipmentId
    this.status = status
    this.description = description
    this.location = location
    this.timestamp = timestamp
    this.courierReference = courierReference
    this.#assertValid()
  }

  #assertValid() {
    if (!this.shipmentId || !this.status) {
      throw new Error('Tracking event requires shipmentId and status')
    }
    if (!Object.values(SHIPMENT_STATUS).includes(this.status)) {
      throw new Error('Invalid tracking status')
    }
  }

  isDelivered() {
    return this.status === SHIPMENT_STATUS.DELIVERED
  }

  isInTransit() {
    return this.status === SHIPMENT_STATUS.IN_TRANSIT
  }

  static fromPrimitives(raw) {
    return new TrackingEvent(raw)
  }

  toPrimitives() {
    return {
      id: this.id,
      shipmentId: this.shipmentId,
      status: this.status,
      description: this.description,
      location: this.location,
      timestamp: this.timestamp,
      courierReference: this.courierReference,
    }
  }
}
