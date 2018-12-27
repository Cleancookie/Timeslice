'use strict'

var Request = require('@adonisjs/framework/src/Request')
var Response = require('@adonisjs/framework/src/Response')
var View = require('@adonisjs/framework/src/View')

class AppController {

  /**
   *
   * @param {Object} param0
   * @param {Request} param0.request
   * @param {Response} param0.response
   * @param {View} param0.view
   */
  home({request, response, view}) {
    return view.render('homepage');
  }
}

module.exports = AppController
