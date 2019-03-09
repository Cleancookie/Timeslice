'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Stage extends Model {
  tasks() {
    return this.hasMany('App/Models/Task')
  }

  projects() {
    return this.belongsTo('App/Models/Project')
  }
}

module.exports = Stage
