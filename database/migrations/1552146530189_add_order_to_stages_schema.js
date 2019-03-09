'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StagesSchema extends Schema {
  up () {
    this.table('stages', (table) => {
      table.integer('order').nullable()
    })
  }

  down () {
    this.table('stages', (table) => {
      table.dropColumn('order')
    })
  }
}

module.exports = StagesSchema
