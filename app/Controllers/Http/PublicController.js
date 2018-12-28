'use strict'
var AppController = require('./AppController');

class PublicController extends AppController {
  home({req, res, view}) {
    return super.home({req, res, view});
  }
}

module.exports = PublicController
