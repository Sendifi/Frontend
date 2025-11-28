import { DeliveryPersonRepository } from '../../domain/repository/DeliveryPersonRepository.js'
import { DeliveryApi } from '../api/DeliveryApi.js'
import { DeliveryAssembler } from '../assembler/DeliveryAssembler.js'
import { DeliveryPerson } from '../../domain/model/DeliveryPerson.js'

export class DeliveryPersonRepositoryImpl extends DeliveryPersonRepository {
  async findAll() {
    const data = await DeliveryApi.getAll()
    return DeliveryAssembler.toDomainCollection(data)
  }

  async findById(id) {
    const data = await DeliveryApi.getById(id)
    return DeliveryAssembler.toDomain(data)
  }

  async findByCode(code) {
    const data = await DeliveryApi.getByCode(code)
    return DeliveryAssembler.toDomain(data)
  }

  async create(deliveryPerson) {
    const payload = DeliveryAssembler.toDTO(deliveryPerson)
    if (!payload.code) {
      payload.code = DeliveryPerson.generateCode()
    }
    const data = await DeliveryApi.create(payload)
    return DeliveryAssembler.toDomain(data)
  }

  async update(id, payload) {
    const data = await DeliveryApi.update(id, payload)
    return DeliveryAssembler.toDomain(data)
  }

  async delete(id) {
    return DeliveryApi.remove(id)
  }
}
