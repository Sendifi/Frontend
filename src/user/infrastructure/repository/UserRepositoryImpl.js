import { UserRepository } from '../../domain/repository/UserRepository.js'
import { UserApi } from '../api/UserApi.js'
import { UserAssembler } from '../assembler/UserAssembler.js'
import { UserAuthService } from '../../domain/service/UserAuthService.js'

const STORAGE_KEY = 'sendify_session_user'

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
    const rawUsers = await UserApi.getAll()
    const authenticated = UserAuthService.authenticate(command, rawUsers)
    persistUser(authenticated)
    return authenticated
  }

  async getCurrentUser() {
    const cached = restoreUser()
    if (!cached?.id) return null
    const user = await UserApi.getById(cached.id).catch(() => cached)
    return UserAssembler.toDomain(user)
  }

  async logout() {
    persistUser(null)
    return true
  }
}
