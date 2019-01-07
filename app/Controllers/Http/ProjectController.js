'use strict'
/** @type {typeof import('App/Models/Project')} */
const Project = use('App/Models/Project')
/** @type {typeof import('App/Models/User')} */
const User = use('App/Models/User')

class ProjectController {

  /**
   * Create/save a new project.
   * POST /projects/store
   *
   * @param {Context} ctx
   */
  async create ({ request, response, auth, view}) {
    let user = await auth.getUser()

    if (user) {
      let newProject = await Project.create({
        "name": request.body['name']
      })
      newProject.users().save(user)

      return view.render('ajax/project-card', {
        "project": newProject
      })
    }

    response.status(500)
    response.send({
      "success": "false",
      "error": "Invalid user"
    })
    return
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
}

module.exports = ProjectController
