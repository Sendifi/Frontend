export class Report {
  constructor({ id = null, name, data = [], generatedAt = new Date().toISOString() }) {
    this.id = id
    this.name = name
    this.data = data
    this.generatedAt = generatedAt
  }
}
