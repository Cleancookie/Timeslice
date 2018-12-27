'use strict'
var AppController = require('./AppController');

class PublicController extends AppController {
  home(ctx) {
    console.log('test');
    return super.home(ctx);
  }
}

module.exports = PublicController
