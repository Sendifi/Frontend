import { User } from '../model/User.js'

export class UserAuthService {
  static authenticate(credentials, users) {
    const { username, password } = credentials
    const match = users.find((user) => user.username === username && user.password === password)
    if (!match) {
      throw new Error('errors.invalidCredentials')
    }
    return User.fromPrimitives({ ...match, token: btoa(`${username}:${Date.now()}`) })
  }
}
