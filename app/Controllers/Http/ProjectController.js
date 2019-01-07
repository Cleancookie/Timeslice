'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('App/Models/Project')} */
const Project = use('App/Models/Project')

class ProjectController {

  /**
   * Create/save a new project.
   * POST projects
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
}

module.exports = ProjectController
