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
    const Alex = await User.findBy('username', 'alex')

    const projects = await Factory.model('App/Models/Project').createMany(5)

    // Create a few projects for Alex
    await Alex.projects().saveMany(projects)
    projects.forEach(async (project) => {
      console.log(project.id)
      // Create stages for each project
      const stages = await Factory.model('App/Models/Stage').createMany(5)
      await project.stages().saveMany(stages)

      // Create tasks are in each stage
      stages.forEach(async (stage) => {
        const tasks = await Factory.model('App/Models/Task').createMany(5)

        // Assign all tasks to Alex
        tasks.forEach(async (task) => {
          task.user_id = Alex.id
          task.project_id = project.id
        })

        await stage.tasks().saveMany(tasks)
      })
    })
  }
}

module.exports = AlexSeeder
