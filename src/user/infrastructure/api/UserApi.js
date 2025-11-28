import { httpClient } from '../../../core/api/httpClient.js'

const RESOURCE = '/users'
const AUTH_RESOURCE = '/auth'

export const UserApi = {
  async login(payload) {
    const response = await httpClient.post(`${AUTH_RESOURCE}/login`, payload)
    return response.data
  },
  async logout() {
    const response = await httpClient.post(`${AUTH_RESOURCE}/logout`)
    return response.data
  },
  async getCurrent() {
    const response = await httpClient.get(`${RESOURCE}/me`)
    return response.data
  },
  async getAll() {
    const response = await httpClient.get(RESOURCE)
    return response.data
  },
  async getById(id) {
    const response = await httpClient.get(`${RESOURCE}/${id}`)
    return response.data
  },
}
