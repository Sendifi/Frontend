import { UserAuthService } from '../../domain/service/UserAuthService.js'

export class LoginUserHandler {
  constructor({ userRepository }) {
    this.userRepository = userRepository
  }

  async execute(command) {
    return this.userRepository.login(command)
  }
}
