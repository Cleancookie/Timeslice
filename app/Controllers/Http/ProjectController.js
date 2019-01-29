'use strict'
/** @type {typeof import('App/Models/Project')} */
const Project = use('App/Models/Project')
/** @type {typeof import('App/Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Database')} */
const Database = use('Adonis/Src/Database')

class ProjectController {
  async index({ auth }) {
    const user = await auth.getUser()
    return await user.projects().fetch()
  }

  /**
   * Create a new project
   *
   * @param {Context} ctx
   */
  async create ({ request, auth }) {
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
   *
   * @param {Context} ctx
   */
  async read ({ request, auth, params }) {
  }

  /**
   * Edits a projects details
   *
   * @param {Context} ctx
   */
  async edit ({ request, auth, params }) {
  }

  /**
   * Deletes a project
   *
   * @param {Context} ctx
   */
  async delete ({ request, auth, params }) {
    const user = auth.getUser()
    const { id } = params
    const project = await Project.findByOrFail(id)
  }
}

module.exports = ProjectController
