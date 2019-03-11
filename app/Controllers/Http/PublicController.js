'use strict'

class PublicController {
  /**
   * Render homepage
   *
   * @param {Context} ctx
   */
  async home({ request, response, view }) {
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

  async logout({ request, response, auth }) {
    await auth.logout()
    return response.redirect('/login')
  }

  /**
   * Render dashboard page
   *
   * @param {Context} ctx
   */
  async dashboard({ request, response, auth, view }) {
    try {
      await auth.getUser()
      return view.render('dashboard')
    } catch (error) {
      console.log(error)
      return response.redirect('/login')
    }
  }
}

module.exports = PublicController
