export class DeliveryPerson {
  constructor({ id, name, code, phone, assignedShipments = [] }) {
    this.id = id
    this.name = name
    this.code = code
    this.phone = phone
    this.assignedShipments = assignedShipments
    this.#assertValid()
  }

  #assertValid() {
    if (!this.name || !this.code) {
      throw new Error('Delivery person requires name and code')
    }
  }

  generateCode() {
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
      assignedShipments: this.assignedShipments,
    }
  }
}
