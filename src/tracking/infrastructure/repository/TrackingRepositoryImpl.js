import { TrackingRepository } from '../../domain/repository/TrackingRepository.js'
import { TrackingApi } from '../api/TrackingApi.js'
import { TrackingAssembler } from '../assembler/TrackingAssembler.js'

export class TrackingRepositoryImpl extends TrackingRepository {
  async findByShipmentId(shipmentId) {
    const data = await TrackingApi.findByShipmentId(shipmentId)
    return TrackingAssembler.toDomainCollection(data)
  }

  async appendEvent(payload) {
    const data = await TrackingApi.create(payload)
    return TrackingAssembler.toDomain(data)
  }
}
