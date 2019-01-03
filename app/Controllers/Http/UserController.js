'use strict'

const PublicController = use('App/Controllers/Http/PublicController')

/** @type {typeof import('App/Models/User')} */
const User = use('App/Models/User')

class UserController extends PublicController {
  /**
   * GET show login form
   *
   * @param {Context} ctx
   */
  async login({view}) {
    return view.render('User/login');
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
   * POST authenticate a user
   *
   * @param {Context} ctx
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

  /**
   * POST register, validates and logs in a user
   *
   * @param {Context} ctx
   */
  async register({request, response, session, auth}) {
    if (request.body['password'] !== request.body['confirm-password']) {
      session.flash({validationError: "Passwords do not match"})
      response.redirect('/login')
      return
    }

    await User.create({
      username: request.body['username'],
      password: request.body['password']
    })

    let loggedIn = false;
    try {
      loggedIn = await auth.attempt(request.body['username'], request.body['password'])
    } catch(e) {
      session.flash({ invalidLogin : "Your account has been created but we were unable to log you in" })
    }

    if (loggedIn) {
      response.redirect('/dashboard')
      return
    }

    response.redirect('/login')
    return
  }

  /**
   * GET Displays a user's dashboard
   *
   * @param {Context} ctx
   */
  async dashboard({auth, params, view}) {
    return view.render('User/dashboard');
  }
}

module.exports = UserController
