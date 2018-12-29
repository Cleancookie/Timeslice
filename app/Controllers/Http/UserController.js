'use strict'
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


var PublicController = require('./PublicController');

class UserController extends PublicController {
  /**
   * POST Log in a user
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  login({request, response, view}) {
    return view.render('User/login');
  }

  authenticateUser({request, response, auth}) {
    console.log(request);
    let { username, password } = request.all();
    auth.attempt(username, password);

    return response.redirect('/dashboard');
  }

  /**
   * Displays a user's dashboard
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {object} ctx.params
   * @param {View} ctx.view
   */
  dashboard({auth, params, view}) {

    return view.render('User/dashboard');
  }
}

module.exports = UserController
