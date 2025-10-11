import { DeliveryPerson } from '../../domain/model/DeliveryPerson.js'

export const DeliveryAssembler = {
  toDomain(raw) {
    return raw ? DeliveryPerson.fromPrimitives(raw) : null
  },
  toDomainCollection(rawCollection) {
    return Array.isArray(rawCollection) ? rawCollection.map(DeliveryAssembler.toDomain) : []
  },
  toDTO(entity) {
    return entity instanceof DeliveryPerson ? entity.toPrimitives() : entity
  },
}
