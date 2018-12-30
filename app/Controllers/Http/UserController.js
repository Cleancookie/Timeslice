'use strict'
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


var PublicController = require('./PublicController');

/** @type {typeof import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class UserController extends PublicController {
  /**
   * GET show login form
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async login({request, response, view}) {
    return view.render('User/login');
  }

    /**
   * POST authenticate a user
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async authenticateUser({request, response, auth}) {
    let { username, password } = request.all()
    let hashedPassword = await Hash.make(password)

    if (await auth.attempt(username, password)) {
      response.redirect('/dashboard')
      return
    }

    response.redirect('/login')
    return
  }

  async logout({response, auth}) {
    await auth.logout()
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
