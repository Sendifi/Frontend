import { httpClient } from '../../../core/api/httpClient.js'
import { toApiShipmentStatus } from '../../../core/utils/statusMapper.js'

const RESOURCE = '/shipments'

export const ShippingApi = {
  async getAll(params = {}) {
    const mappedParams = { ...params }
    if (params.status) {
      mappedParams.status = toApiShipmentStatus(params.status)
    }
    const response = await httpClient.get(RESOURCE, { params: mappedParams })
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
    const body = { ...payload }
    if (payload?.status) {
      body.status = toApiShipmentStatus(payload.status)
    }
    const response = await httpClient.patch(`${RESOURCE}/${id}`, body)
    return response.data
  },
  async delete(id) {
    await httpClient.delete(`${RESOURCE}/${id}`)
    return true
  },
}
