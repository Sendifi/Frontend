import { httpClient } from '../../../core/api/httpClient.js'

const RESOURCE = '/shipments'

export const ShippingApi = {
  async getAll(params = {}) {
    const response = await httpClient.get(RESOURCE, { params })
    return response.data
  },
  async getById(id) {
    const response = await httpClient.get(`${RESOURCE}/${id}`)
    return response.data
  },
  async getByTrackingCode(code) {
    const response = await httpClient.get(RESOURCE, { params: { trackingCode: code } })
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
  async delete(id) {
    await httpClient.delete(`${RESOURCE}/${id}`)
    return true
  },
}
