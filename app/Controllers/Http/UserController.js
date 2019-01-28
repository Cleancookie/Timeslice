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
  async logout({response, auth}) {
    await auth.logout()
    response.redirect('/login')
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

  /**
   * GET Displays a user's dashboard
   *
   * @param {Context} ctx
   */
  async dashboard({auth, params, view}) {
    let projects = await auth.user.projects().fetch();

    return view.render('dashboard', {
      projects: projects.toJSON()
    })
  }
}

module.exports = UserController
