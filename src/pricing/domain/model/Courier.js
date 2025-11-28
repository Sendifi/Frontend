export class Courier {
  constructor({ id, name, costPerKg, estimatedDays, pricing = {}, baseCost = 0, isActive = true }) {
    this.id = id
    this.name = name
    this.costPerKg = Number(costPerKg ?? pricing.perKg ?? 0)
    this.baseCost = Number(baseCost ?? pricing.baseCost ?? 0)
    this.estimatedDays = Number(estimatedDays ?? pricing.estimatedDays ?? 0)
    this.isActive = isActive
  }

  isValid() {
    return Boolean(this.name) && this.costPerKg >= 0
  }

  static fromPrimitives(raw) {
    return new Courier(raw)
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      costPerKg: this.costPerKg,
      baseCost: this.baseCost,
      estimatedDays: this.estimatedDays,
      isActive: this.isActive,
      pricing: {
        baseCost: this.baseCost,
        perKg: this.costPerKg,
      },
    }
  }
}
