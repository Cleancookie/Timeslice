'use strict'

/*
|--------------------------------------------------------------------------
| AlexSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
/** @type {import('app/Models/User')} */
const User = use('App/Models/User')

class AlexSeeder {
  async run() {
    this.Alex = await User.findBy('username', 'alex')

    let projects = await Factory.model('App/Models/Project').createMany(15)

    // Create a few projects for Alex
    await this.Alex.projects().saveMany(projects)

    // Add stages to each project
    for (let i = 0; i < projects.length; i++) {
      console.log(`Creating project ${i + 1} of ${projects.length}`)
      let stages = await Factory.model('App/Models/Stage').createMany(6)
      await projects[i].stages().saveMany(stages)

      // Create tasks for each stage
      for (let j = 0; j < stages.length; j++) {
        let tasks = await Factory.model('App/Models/Task').createMany(10)
        await stages[j].tasks().saveMany(tasks)
        await this.Alex.tasks().saveMany(tasks)
        await projects[i].tasks().saveMany(tasks)
      }
    }
  }
}

module.exports = AlexSeeder
