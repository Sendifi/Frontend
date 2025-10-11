export class Courier {
  constructor({ id, name, costPerKg, estimatedDays }) {
    this.id = id
    this.name = name
    this.costPerKg = Number(costPerKg)
    this.estimatedDays = Number(estimatedDays)
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
      estimatedDays: this.estimatedDays,
    }
  }
}
