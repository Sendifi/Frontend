import { defineStore } from 'pinia'
import { UserRepositoryImpl } from '../infrastructure/repository/UserRepositoryImpl.js'
import { LoginUserHandler } from './handler/LoginUserHandler.js'
import { LoginUserCommand } from './command/LoginUserCommand.js'
import { LogoutUserHandler } from './handler/LogoutUserHandler.js'
import { GetCurrentUserHandler } from './handler/GetCurrentUserHandler.js'

const userRepository = new UserRepositoryImpl()

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser),
    role: (state) => state.currentUser?.role ?? null,
  },
  actions: {
    async login({ email, password }) {
      this.loading = true
      this.error = null
      try {
        const handler = new LoginUserHandler({ userRepository })
        const user = await handler.execute(new LoginUserCommand({ email, password }))
        this.currentUser = user
        return user
      } catch (error) {
        this.error = error.message || error.error || 'errors.loginFailed'
        throw error
      } finally {
        this.loading = false
      }
    },
    async logout() {
      const handler = new LogoutUserHandler({ userRepository })
      await handler.execute()
      this.currentUser = null
    },
    async getCurrentUser() {
      this.loading = true
      try {
        const handler = new GetCurrentUserHandler({ userRepository })
        this.currentUser = await handler.execute()
      } finally {
        this.loading = false
      }
    },
  },
})
