export class DeliveryPerson {
  constructor({ id, name, code, phone, assignedShipments = [], isActive = true }) {
    this.id = id
    this.name = name
    this.code = code || null
    this.phone = phone
    this.isActive = isActive
    this.assignedShipments = Array.isArray(assignedShipments) ? assignedShipments : []
    this.#assertValid()
  }

  #assertValid() {
    if (!this.name || !this.phone) {
      throw new Error('Delivery person requires name and phone')
    }
  }

  static generateCode() {
    return `DEL${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`
  }

  assignShipment(shipmentId) {
    if (!this.assignedShipments.includes(shipmentId)) {
      this.assignedShipments.push(shipmentId)
    }
  }

  removeShipment(shipmentId) {
    this.assignedShipments = this.assignedShipments.filter((id) => id !== shipmentId)
  }

  static fromPrimitives(raw) {
    return new DeliveryPerson(raw)
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      phone: this.phone,
      isActive: this.isActive,
      assignedShipments: this.assignedShipments,
    }
  }
}
