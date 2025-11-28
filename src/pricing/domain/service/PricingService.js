export class PricingService {
  static calculateQuote({ weight, courier }) {
    if (!courier) return 0
    const base = courier.baseCost || 0
    return Math.round(base + (weight || 0) * courier.costPerKg)
  }
}
