'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectUserSchema extends Schema {
  up() {
    this.create('project_user', (table) => {
      table.increments()
      table.integer('user_id')
      table.integer('project_id')
      table.timestamps()
    })
  }

  down() {
    this.drop('project_user')
  }
}

module.exports = ProjectUserSchema
