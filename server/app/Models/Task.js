'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Task extends Model {
  projects() {
    return this.belongsTo('App/Models/Project')
  }

  stages() {
    return this.belongsTo('App/Models/Stage')
  }

  users() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Task
