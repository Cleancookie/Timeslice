'use strict'

/** @type {typeof import('App/Controllers/Http/PublicController')} */
const PublicController = use('App/Controllers/Http/PublicController')

/** @type {typeof import('App/Models/User')} */
const User = use('App/Models/User')

class UserController extends PublicController {
  /**
   * GET show login form
   *
   * @param {Context} ctx
   */
  async login({request, auth}) {
    let {email, password} = request.all()
    let token = await auth.attempt(email, password)
    return token;
  }

  /**
   * GET logs a user out
   *
   * @param {Context} ctx
   */
  async logout({request, response, auth}) {
    let { token } = request.all();
    await auth.authenticator('jwt').revokeTokens([token])
    return
  }

  /**
   * POST register, validates and logs in a user
   *
   * @param {Context} ctx
   */
  async register({request, response, auth}) {
    if (request.body['password'] !== request.body['confirm-password']) {
      response.json({
        errors: [
          {
            'field': 'confirm-password',
            'message': 'Passwords do not match'
          }
        ]
      })
      return
    }

    return this.login(...arguments)
  }
}

module.exports = UserController
