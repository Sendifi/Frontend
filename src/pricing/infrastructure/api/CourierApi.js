import { httpClient } from '../../../core/api/httpClient.js'

const RESOURCE = '/couriers'

export const CourierApi = {
  async getAll() {
    const response = await httpClient.get(RESOURCE)
    return response.data
  },
  async getById(id) {
    const response = await httpClient.get(`${RESOURCE}/${id}`)
    return response.data
  },
}
