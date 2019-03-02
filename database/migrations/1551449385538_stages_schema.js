'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StagesSchema extends Schema {
  up() {
    this.create('stages', (table) => {
      table.increments()
      table.string('name', 255)
      table.datetime('deleted_at')
      table.timestamps()
    })
  }

  down() {
    this.drop('stages')
  }
}

module.exports = StagesSchema
