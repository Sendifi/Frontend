import { SHIPMENT_STATUS } from '../../../core/constants/domainConstants.js'
import { Address } from './Address.js'

const VALID_STATUSES = new Set(Object.values(SHIPMENT_STATUS))

export class Shipment {
  constructor({
    id,
    trackingCode,
    sender,
    recipient,
    originAddress,
    destinationAddress,
    weight,
    cost,
    status = SHIPMENT_STATUS.PENDING,
    courierId,
    deliveryPersonId = null,
    estimatedDelivery,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  }) {
    this.id = id
    this.trackingCode = trackingCode || Shipment.generateTrackingCode()
    this.sender = sender
    this.recipient = recipient
    this.originAddress = originAddress instanceof Address ? originAddress : Address.fromPrimitives(originAddress)
    this.destinationAddress =
      destinationAddress instanceof Address ? destinationAddress : Address.fromPrimitives(destinationAddress)
    this.weight = weight != null ? Number(weight) : 0
    this.cost = cost != null ? Number(cost) : 0
    this.status = status
    this.courierId = courierId
    this.deliveryPersonId = deliveryPersonId
    this.estimatedDelivery = estimatedDelivery
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.#assertValid()
  }

  #assertValid() {
    if (!this.sender?.name || !this.recipient?.name) {
      throw new Error('Shipment requires sender and recipient')
    }
    if (!VALID_STATUSES.has(this.status)) {
      throw new Error(`Invalid status ${this.status}`)
    }
    if (!this.originAddress?.isValid() || !this.destinationAddress?.isValid()) {
      throw new Error('Origin and destination addresses must be valid')
    }
  }

  updateStatus(newStatus) {
    if (!VALID_STATUSES.has(newStatus)) {
      throw new Error(`Invalid status ${newStatus}`)
    }
    this.status = newStatus
    this.updatedAt = new Date().toISOString()
  }

  assignDeliveryPerson(deliveryPersonId) {
    if (!deliveryPersonId) {
      throw new Error('Delivery person id required')
    }
    this.deliveryPersonId = deliveryPersonId
    this.updatedAt = new Date().toISOString()
  }

  isValid() {
    try {
      this.#assertValid()
      return true
    } catch {
      return false
    }
  }

  static generateTrackingCode() {
    const prefix = 'SFY'
    const random = Math.floor(Math.random() * 1_000_000_000)
    return `${prefix}${random.toString().padStart(9, '0')}`
  }

  static fromPrimitives(raw) {
    return new Shipment(raw)
  }

  toPrimitives() {
    return {
      id: this.id,
      trackingCode: this.trackingCode,
      sender: this.sender,
      recipient: this.recipient,
      originAddress: this.originAddress?.toPrimitives(),
      destinationAddress: this.destinationAddress?.toPrimitives(),
      weight: this.weight,
      cost: this.cost,
      status: this.status,
      courierId: this.courierId,
      deliveryPersonId: this.deliveryPersonId,
      estimatedDelivery: this.estimatedDelivery,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
