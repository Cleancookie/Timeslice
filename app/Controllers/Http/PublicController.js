'use strict'

class PublicController {
  /**
   * Render homepage
   *
   * @param {Context} ctx
   */
  async home({ req, res, view }) {
    return view.render('homepage')
  }

  /**
   * Render login / register page
   *
   * @param {Context} ctx
   */
  async login({ req, res, view }) {
    return view.render('login')
  }

  /**
   * Render dashboard page
   *
   * @param {Context} ctx
   */
  async dashboard({ req, res, view }) {
    return view.render('dashboard')
  }
}

module.exports = PublicController
