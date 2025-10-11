import { Shipment } from '../../domain/model/Shipment.js'

export const ShipmentAssembler = {
  toDomain(raw) {
    if (!raw) return null
    return Shipment.fromPrimitives(raw)
  },

  toDomainCollection(rawCollection) {
    return Array.isArray(rawCollection) ? rawCollection.map(ShipmentAssembler.toDomain) : []
  },

  toDTO(entity) {
    return entity instanceof Shipment ? entity.toPrimitives() : entity
  },
}
