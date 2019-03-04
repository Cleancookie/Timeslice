"use strict"
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class InjectViewGlobal {
  /**
   * @param {Context} ctx
   * @param {Function} next
   */
  async handle({ request }, next) {
    const View = use("View")
    const _ = use("lodash")

    View.global("_", function(method, args) {
      return _[method](args)
    })
    await next()
  }
}

module.exports = InjectViewGlobal
