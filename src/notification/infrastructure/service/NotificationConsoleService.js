export class NotificationConsoleService {
  static async send(notification) {
    if (typeof console !== 'undefined') {
      console.info('Notification sent', notification)
    }
    return true
  }
}
