'use strict'
const PublicController = require('./PublicController');

class UserController extends PublicController {
  /**
   * GET show login form
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async login({request, response, view}) {
    return view.render('User/login');
  }

  /**
   * GET logs a user out
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async logout({response, auth}) {
    await auth.logout()
    response.redirect('/login')
    return
  }

  /**
   * POST authenticate a user
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   * @param {Session} ctx.session
   */
  async authenticateUser({request, response, auth, session}) {
    let loggedIn = false;
    try {
      loggedIn = await auth.attempt(request.body['username'], request.body['password'])
    } catch(e) {
      session.flash({ invalidLogin : "Your login details were incorrect.  Please try again" });
    }

    if (loggedIn) {
      response.redirect('/dashboard')
      return
    }

    response.redirect('/login', true)
    return
  }

  async register({request, response, session}) {
    if (request.body['password'] !== request.body['confirm-password']) {
      session.flash({validationError: "Passwords do not match"})
      response.redirect('/login')
      return
    }

    response.redirect('/')
    return
  }

  /**
   * GET Displays a user's dashboard
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {object} ctx.params
   * @param {View} ctx.view
   */
  async dashboard({auth, params, view}) {
    return view.render('User/dashboard');
  }
}

module.exports = UserController
