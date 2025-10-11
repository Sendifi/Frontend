import { User } from '../../domain/model/User.js'

export const UserAssembler = {
  toDomain(raw) {
    return raw ? User.fromPrimitives(raw) : null
  },
  toDomainCollection(rawCollection) {
    return Array.isArray(rawCollection) ? rawCollection.map(UserAssembler.toDomain) : []
  },
}
