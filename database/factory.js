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

Factory.blueprint('App/Models/Project', (faker, i, data) => {
  return {
    name: faker.word()
  }
})

Factory.blueprint('App/Models/Stage', (faker, i, data) => {
  switch (i) {
    case 0:
      return {
        name: 'Backlog',
        order: i
      }
    case 1:
      return {
        name: 'Scheduled',
        order: i
      }
    case 2:
      return {
        name: 'In Progress',
        order: i
      }
    case 3:
      return {
        name: 'Testing',
        order: i
      }
    case 4:
      return {
        name: 'Awaiting Sign Off',
        order: i
      }
    case 5:
      return {
        name: 'Ready to Deploy',
        order: i
      }
  }
})

Factory.blueprint('App/Models/Task', (faker, i, data) => {
  return {
    name: faker.word(),
    description: faker.sentence()
  }
})
