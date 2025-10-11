export class Notification {
  constructor({ id = null, message, type = 'INFO', recipient = null, createdAt = new Date().toISOString() }) {
    this.id = id
    this.message = message
    this.type = type
    this.recipient = recipient
    this.createdAt = createdAt
  }
}
