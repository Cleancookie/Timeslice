'use strict'

class AppController {

  home({req, res, view}) {
    return view.render('homepage');
  }
}

module.exports = AppController
