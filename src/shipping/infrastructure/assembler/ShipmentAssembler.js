import { Shipment } from '../../domain/model/Shipment.js'
import { toApiShipmentStatus, toDomainShipmentStatus } from '../../../core/utils/statusMapper.js'

export const ShipmentAssembler = {
  toDomain(raw) {
    if (!raw) return null
    const normalized = { ...raw, status: toDomainShipmentStatus(raw.status) }
    return Shipment.fromPrimitives(normalized)
  },

  toDomainCollection(rawCollection) {
    return Array.isArray(rawCollection) ? rawCollection.map(ShipmentAssembler.toDomain) : []
  },

  toDTO(entity) {
    const payload = entity instanceof Shipment ? entity.toPrimitives() : entity
    return { ...payload, status: toApiShipmentStatus(payload.status) }
  },
}
