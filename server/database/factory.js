'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database')

Factory.blueprint('App/Models/User', async (faker) => {
  return {
    username: faker.username(),
    password: await Hash.make(faker.password())
  }
})

Factory.blueprint('App/Models/Stage', (faker) => {
  return {
    name: faker.word()
  }
})
