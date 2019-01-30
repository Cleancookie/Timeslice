"use strict"

class AppController {
  async home({ req, res, view }) {
    return view.render("homepage")
  }
}

module.exports = AppController
