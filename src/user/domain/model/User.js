import { USER_ROLES } from '../../../core/constants/domainConstants.js'

export class User {
  constructor({ id, name, username, email, role, avatar = null, isActive = true, token = null }) {
    this.id = id
    this.name = name || username || email
    this.username = username || email
    this.email = email
    this.role = role
    this.avatar = avatar
    this.isActive = isActive
    this.token = token
    this.#assertValid()
  }

  #assertValid() {
    if (!this.email || !this.role) {
      throw new Error('User requires email and role')
    }
    if (this.role && !Object.values(USER_ROLES).includes(this.role)) {
      throw new Error(`Invalid role ${this.role}`)
    }
  }

  isAdmin() {
    return this.role === USER_ROLES.ADMIN
  }
  get displayName() {
    return this.name || this.username || this.email
  }

  static fromPrimitives(raw) {
    return new User(raw)
  }
}
