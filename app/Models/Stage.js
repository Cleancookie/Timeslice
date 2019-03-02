'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Stage extends Model {
  tasks() {
    return this.hasMany('App/Models/Task')
  }
}

module.exports = Stage
