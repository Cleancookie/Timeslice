'use strict'

class AppController {
  async home({req, res, view}) {
    return view.render('homepage');
  }

  async handle() {
    console.log('yerd')
  }
}

module.exports = AppController
