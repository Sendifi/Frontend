import { USER_ROLES } from '../../../core/constants/domainConstants.js'

export class User {
  constructor({ id, username, email, role, token = null }) {
    this.id = id
    this.username = username
    this.email = email
    this.role = role
    this.token = token
    this.#assertValid()
  }

  #assertValid() {
    if (!this.username || !this.role) {
      throw new Error('User requires username and role')
    }
    if (!Object.values(USER_ROLES).includes(this.role)) {
      throw new Error(`Invalid role ${this.role}`)
    }
  }

  isAdmin() {
    return this.role === USER_ROLES.ADMIN
  }

  static fromPrimitives(raw) {
    return new User(raw)
  }
}
