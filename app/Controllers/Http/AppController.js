'use strict'

class AppController {

  async home({request, response, view}) {
    return view.render('homepage');
  }
}

module.exports = AppController
