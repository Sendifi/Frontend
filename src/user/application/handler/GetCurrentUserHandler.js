export class GetCurrentUserHandler {
  constructor({ userRepository }) {
    this.userRepository = userRepository
  }

  async execute() {
    return this.userRepository.getCurrentUser()
  }
}
