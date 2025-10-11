export class LogoutUserHandler {
  constructor({ userRepository }) {
    this.userRepository = userRepository
  }

  async execute() {
    return this.userRepository.logout()
  }
}
