'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StagesSchema extends Schema {
  up () {
    this.table('stages', (table) => {
      table.integer('project_id').after('name')
      table.datetime('deleted_at').after('updated_at')
    })
  }

  down () {
    this.table('stages', (table) => {
      table.dropColumn('project_id')
      table.dropColumn('deleted_at')
    })
  }
}

module.exports = StagesSchema
