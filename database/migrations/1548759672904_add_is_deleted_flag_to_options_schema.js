'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddIsDeletedFlagToOptionsSchema extends Schema {
  up () {
    this.table('projects', (table) => {
      table.datetime('deleted_at')
    })
  }

  down () {
    this.table('projects', (table) => {
      table.dropColumn('deleted_at')
    })
  }
}

module.exports = AddIsDeletedFlagToOptionsSchema
