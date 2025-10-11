import { TrackingEvent } from '../../domain/model/TrackingEvent.js'

export const TrackingAssembler = {
  toDomain(raw) {
    return raw ? TrackingEvent.fromPrimitives(raw) : null
  },
  toDomainCollection(rawCollection) {
    return Array.isArray(rawCollection) ? rawCollection.map(TrackingAssembler.toDomain) : []
  },
}
