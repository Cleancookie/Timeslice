'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StagesSchema extends Schema {
  up () {
    this.table('stages', (table) => {
      table.integer('project_id').after('name')
    })
  }

  down () {
    this.table('stages', (table) => {
      table.dropColumn('project_id')
    })
  }
}

module.exports = StagesSchema
