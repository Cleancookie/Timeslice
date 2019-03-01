'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUsersToTasksSchema extends Schema {
  up () {
    this.table('tasks', (table) => {
      table.integer('user_id')
    })
  }

  down () {
    this.table('tasks', (table) => {
      table.dropColumn('user_id')
    })
  }
}

module.exports = AddUsersToTasksSchema
