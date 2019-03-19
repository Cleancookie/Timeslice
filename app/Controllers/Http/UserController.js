'use strict'

/** @type {typeof import('App/Models/User')} */
const User = use('App/Models/User')

class UserController {
  /**
   * Authenticate a user and return JWT
   *
   * @param {Context} ctx
   */
  async login({ request, auth }) {
    let { username, password } = request.all()
    let token = await auth.attempt(username, password)
    return token
  }

  /**
   * Invalidate a given JWT
   *
   * @param {Context} ctx
   */
  async logout({ request, response, auth }) {
    let { token } = request.all()
    await auth.authenticator('jwt').revokeTokens([token])
    await auth.logout()
    return {
      success: true,
      message: 'logged out'
    }
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
      'confirm-password': confirmPassword
    } = request.all()

    if (password !== confirmPassword) {
      return response.status(403).json({
        error: [
          {
            field: 'confirm-password',
            message: 'Passwords do not match'
          }
        ]
      })
    }

    let user = new User()
    user.fill({
      username: username,
      password: password
    })
    await user.save()
    console.log('New account created')

    return this.login(...arguments)
  }

  /**
   * Gets a list of all users
   *
   * @param {Context} ctx
   */
  async index({ request, response }) {
    let { q } = request.all()
    let users = await User.query()
      .where('username', 'LIKE', `%${q}%`)
      .fetch()

    return response.json({
      success: true,
      data: users
    })
  }
}

module.exports = UserController
