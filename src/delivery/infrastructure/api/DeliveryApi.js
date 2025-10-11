import { httpClient } from '../../../core/api/httpClient.js'

const RESOURCE = '/deliveryPersons'

export const DeliveryApi = {
  async getAll() {
    const response = await httpClient.get(RESOURCE)
    return response.data
  },
  async getById(id) {
    const response = await httpClient.get(`${RESOURCE}/${id}`)
    return response.data
  },
  async getByCode(code) {
    const response = await httpClient.get(RESOURCE, { params: { code } })
    return response.data?.[0] ?? null
  },
  async create(payload) {
    const response = await httpClient.post(RESOURCE, payload)
    return response.data
  },
  async update(id, payload) {
    const response = await httpClient.patch(`${RESOURCE}/${id}`, payload)
    return response.data
  },
  async remove(id) {
    await httpClient.delete(`${RESOURCE}/${id}`)
    return true
  },
}
