'use strict'
/** @type {typeof import('App/Models/Project')} */
const Project = use('App/Models/Project')
/** @type {typeof import('App/Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Database')} */
const Database = use('Adonis/Src/Database')

class ProjectController {
  async index({auth}) {
    const user = await auth.getUser()
    return await user.projects().fetch()
  }

  /**
   * Create/save a new project.
   * POST /projects/store
   *
   * @param {Context} ctx
   */
  async create ({ request, auth}) {
    let user = await auth.getUser()
    let { name } = request.all()
    let project = new Project()

    project.fill({
      name
    })

    await user.projects().save(project);
    return project;
  }

  /**
   * Get details about the selected project
   * GET /projects/:id
   *
   * @param {Context} ctx
   */
  async read ({ params, request, response, auth, view }) {
    let project = await Project.find(params.id)
    let users = await project.users().fetch()

    return view.render('ajax/project-details', {
      project: project.toJSON(),
      users: users.toJSON()
    })
  }

  /**
   * Edits a projects details
   *
   * @param {Context} ctx
   */
  async edit ({params, request, auth, view}) {
    let user = await auth.getUser()
    let project = await Project.find(params.id)

    if (user && project) {
      project.merge({
        name: request.body['name']
      })

      // DEVTODO: Need to be able to edit who is assigned to it too

      project = await project.save()
    }

    let users = project.users().fetch()

    return view.render('ajax/project-details', {
      project: project.toJSON(),
      users: users.toJSON()
    })
  }

  /**
   * Deletes a project
   *
   * @param {Context} ctx
   */
  async delete ({params, response, auth}) {
    let user = await auth.getUser()
    let project = await Project.find(params.id)

    // Check the user they claim to be is assigned
    if (await project.findAssignedUser(user.id)) {
      let assignedUsers = await project.users().fetch();

      // DEVTODO: Efficiency, this could be done in 2 queries instead on n+1 by putting all the
      // user ids into an array and detaching that array

    }
    await project.users().detach()
    await project.delete()

    response.send('deleted project ' + project.toJSON().id)
    return
  }
}

module.exports = ProjectController
