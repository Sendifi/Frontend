export class PricingService {
  static calculateQuote({ weight, courier }) {
    if (!courier) return 0
    return Math.round((weight || 0) * courier.costPerKg)
  }
}
