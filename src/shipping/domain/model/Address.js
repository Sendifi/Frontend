export class Address {
  constructor({ street, city, state, zipCode, country, coordinates = null }) {
    this.street = street
    this.city = city
    this.state = state
    this.zipCode = zipCode
    this.country = country
    this.coordinates = coordinates
    this.#assertValid()
  }

  #assertValid() {
    const required = [this.street, this.city, this.state, this.zipCode, this.country]
    if (required.some((value) => !value)) {
      throw new Error('Address is missing required fields')
    }
  }

  getFullAddress() {
    return `${this.street}, ${this.city}, ${this.state}, ${this.country}, ${this.zipCode}`
  }

  isValid() {
    try {
      this.#assertValid()
      return true
    } catch (error) {
      return false
    }
  }

  equals(other) {
    if (!(other instanceof Address)) return false
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.zipCode === other.zipCode &&
      this.country === other.country
    )
  }

  static fromPrimitives(raw) {
    if (!raw) return null
    return new Address(raw)
  }

  toPrimitives() {
    return {
      street: this.street,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      coordinates: this.coordinates,
    }
  }
}
