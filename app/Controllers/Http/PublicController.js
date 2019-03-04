'use strict'

class PublicController {
  /**
   * Render homepage
   *
   * @param {Context} ctx
   */
  async home({ reé, res, view }) {
    return view.render('homepage')
  }

  /**
   * Render login / register page
   *
   * @param {Context} ctx
   */
  async login({ req, res, auth, view }) {
    return view.render('login')
  }

  /**
   * Render dashboard page
   *
   * @param {Context} ctx
   */
  async dashboard({ req, res, auth, view }) {
    return view.render('dashboard')
  }
}

module.exports = PublicController
