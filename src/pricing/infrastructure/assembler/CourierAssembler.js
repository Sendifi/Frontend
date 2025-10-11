import { Courier } from '../../domain/model/Courier.js'

export const CourierAssembler = {
  toDomain(raw) {
    return raw ? Courier.fromPrimitives(raw) : null
  },
  toDomainCollection(rawCollection) {
    return Array.isArray(rawCollection) ? rawCollection.map(CourierAssembler.toDomain) : []
  },
}
