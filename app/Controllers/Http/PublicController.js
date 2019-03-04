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
