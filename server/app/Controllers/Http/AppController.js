"use strict"

class AppController {
  /**
   * Homepage action
   *
   * @param {Context} ctx
   */
  async home({ req, res, view }) {
    return view.render("homepage")
  }
}

module.exports = AppController
