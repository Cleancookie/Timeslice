"use strict"

/** @type {typeof import('App/Controllers/Http/PublicController')} */
const PublicController = use("App/Controllers/Http/PublicController")

/** @type {typeof import('App/Exceptions/PasswordsDoNotMatchException')} */
const PasswordsDoNotMatchException = use("App/Exceptions/PasswordsDoNotMatch")

/** @type {typeof import('App/Models/User')} */
const User = use("App/Models/User")

class UserController extends PublicController {
  /**
   * GET show login form
   *
   * @param {Context} ctx
   */
  async login({ request, auth }) {
    let { username, password } = request.all()
    let token = await auth.attempt(username, password)
    return token
  }

  /**
   * GET logs a user out
   *
   * @param {Context} ctx
   */
  async logout({ request, response, auth }) {
    let { token } = request.all()
    await auth.authenticator("jwt").revokeTokens([token])
    return
  }

  /**
   * POST register, validates and logs in a user
   *
   * @param {Context} ctx
   */
  async register({ request, response, auth }) {
    const {
      username,
      password,
      "confirm-password": confirmPassword
    } = request.all()
    if (password !== confirmPassword) {
      throw new PasswordsDoNotMatchException()
    }

    let user = new User()
    user.fill({
      username: username
    })

    return this.login(...arguments)
  }
}

module.exports = UserController
