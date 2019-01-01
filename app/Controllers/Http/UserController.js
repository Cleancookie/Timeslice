'use strict'
const PublicController = use('App/Controllers/Http/PublicController')

/** @typedef {import "@adonisjs/lucid/src/Lucid/Model/Base"} */
const User = use('App/Models/User')

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

  /**
   * POST register, validates and logs in a user
   *
   * @param {object} ctx Context
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Session} ctx.session
   * @param {AuthSession} ctx.auth
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
