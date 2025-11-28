import axios from 'axios'
import { SESSION_USER_KEY } from '../constants/storageKeys.js'

const DEFAULT_API_URL = 'https://backsendify-5.onrender.com'

function resolveBaseUrl() {
  const envUrl =
    import.meta.env?.VITE_API_URL ||
    import.meta.env?.VITE_APP_API_URL ||
    (typeof process !== 'undefined' ? process.env?.VITE_API_URL : undefined)

  return envUrl || DEFAULT_API_URL
}

const API_BASE_URL = resolveBaseUrl()

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let authToken = null

function getStoredToken() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SESSION_USER_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed?.token || null
  } catch {
    return null
  }
}

export function setAuthToken(token) {
  authToken = token || null
  if (authToken) {
    httpClient.defaults.headers.common.Authorization = `Bearer ${authToken}`
  } else {
    delete httpClient.defaults.headers.common.Authorization
  }
}

setAuthToken(getStoredToken())

httpClient.interceptors.request.use((config) => {
  const token = authToken || getStoredToken()
  if (token) {
    config.headers = config.headers || {}
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = error?.response?.data || {
      message: error.message,
    }
    return Promise.reject(normalizedError)
  },
)
