import { UserRepository } from '../../domain/repository/UserRepository.js'
import { UserApi } from '../api/UserApi.js'
import { UserAssembler } from '../assembler/UserAssembler.js'
import { setAuthToken } from '../../../core/api/httpClient.js'
import { SESSION_USER_KEY } from '../../../core/constants/storageKeys.js'

const STORAGE_KEY = SESSION_USER_KEY

function persistUser(user) {
  if (typeof window === 'undefined') return
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

function restoreUser() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export class UserRepositoryImpl extends UserRepository {
  async login(command) {
    const response = await UserApi.login({ email: command.email, password: command.password })
    const user = UserAssembler.toDomain({ ...(response?.user || response), token: response?.token })
    persistUser(user)
    setAuthToken(user?.token)
    return user
  }

  async getCurrentUser() {
    const cached = restoreUser()
    if (!cached?.token) return null
    setAuthToken(cached.token)
    const data = await UserApi.getCurrent().catch(() => cached)
    const baseUser = data?.user || data
    if (!baseUser?.email) {
      persistUser(null)
      setAuthToken(null)
      return null
    }
    const user = UserAssembler.toDomain({ ...baseUser, token: cached.token })
    persistUser(user)
    return user
  }

  async logout() {
    const cached = restoreUser()
    if (cached?.token) {
      setAuthToken(cached.token)
      await UserApi.logout().catch(() => {})
    }
    persistUser(null)
    setAuthToken(null)
    return true
  }
}
