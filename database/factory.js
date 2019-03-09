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

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    username: faker.username(),
    password: await Hash.make('pass')
  }
})

Factory.blueprint('App/Models/Stage', (faker, i, data) => {
  return {
    name: faker.word(),
    order: i
  }
})

Factory.blueprint('App/Models/Task', (faker, i, data) => {
  return {
    name: faker.word(),
    description: faker.sentence()
  }
})

Factory.blueprint('App/Models/Project', (faker, i, data) => {
  return {
    name: faker.word()
  }
})
