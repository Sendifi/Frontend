import { TrackingEvent } from '../../domain/model/TrackingEvent.js'
import { toApiTrackingStatus, toDomainTrackingStatus } from '../../../core/utils/statusMapper.js'

export const TrackingAssembler = {
  toDomain(raw) {
    if (!raw) return null
    const normalized = { ...raw, status: toDomainTrackingStatus(raw.status) }
    return TrackingEvent.fromPrimitives(normalized)
  },
  toDomainCollection(rawCollection) {
    return Array.isArray(rawCollection) ? rawCollection.map(TrackingAssembler.toDomain) : []
  },
  toDTO(entity) {
    const payload = entity instanceof TrackingEvent ? entity.toPrimitives() : entity
    return { ...payload, status: toApiTrackingStatus(payload.status) }
  },
}
