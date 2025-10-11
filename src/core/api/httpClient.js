import axios from 'axios'

function resolveBaseUrl() {
  const envUrl =
    import.meta.env?.VITE_API_URL ||
    import.meta.env?.VITE_APP_API_URL ||
    process.env?.VITE_API_URL
  if (envUrl) return envUrl

  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    return isLocalhost ? 'http://localhost:3000' : '/api'
  }

  return process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000'
}

const API_BASE_URL = resolveBaseUrl()

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
