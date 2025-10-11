export class NotificationDomainService {
  static buildMessage({ shipment, status }) {
    return `El envío ${shipment.trackingCode} cambió a estado ${status}`
  }
}
