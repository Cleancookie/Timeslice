'use strict'

/*
|--------------------------------------------------------------------------
| StageSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database')
/** @type {import('app/Models/Stage')} */
const Stage = use('App/Models/Stage')

class StageSeeder {
  async run() {
    if (!(await Stage.findBy('name', 'To Do'))) {
      await Stage.create({
        name: 'To Do'
      })
    }

    if (!(await Stage.findBy('name', 'Doing'))) {
      await Stage.create({
        name: 'Doing'
      })
    }

    if (!(await Stage.findBy('name', 'Done'))) {
      await Stage.create({
        name: 'Done'
      })
    }
  }
}

module.exports = StageSeeder
