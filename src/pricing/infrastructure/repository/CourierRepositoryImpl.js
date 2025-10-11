import { CourierRepository } from '../../domain/repository/CourierRepository.js'
import { CourierAssembler } from '../assembler/CourierAssembler.js'
import { CourierApi } from '../api/CourierApi.js'

export class CourierRepositoryImpl extends CourierRepository {
  async findAll() {
    const data = await CourierApi.getAll()
    return CourierAssembler.toDomainCollection(data)
  }

  async findById(id) {
    const data = await CourierApi.getById(id)
    return CourierAssembler.toDomain(data)
  }
}
