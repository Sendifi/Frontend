import { httpClient } from '../../../core/api/httpClient.js'

const RESOURCE = '/trackingEvents'

export const TrackingApi = {
  async findByShipmentId(shipmentId) {
    const response = await httpClient.get(RESOURCE, { params: { shipmentId } })
    return response.data
  },
  async create(payload) {
    const response = await httpClient.post(RESOURCE, payload)
    return response.data
  },
}
