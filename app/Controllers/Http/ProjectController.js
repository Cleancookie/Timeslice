"use strict"
/** @type {typeof import('App/Models/Project')} */
const Project = use("App/Models/Project")
/** @type {typeof import('App/Models/User')} */
const User = use("App/Models/User")
/** @type {typeof import('@adonisjs/lucid/src/Database')} */
const Database = use("Adonis/Src/Database")
/** @type {typeof import('lodash')} */
const _ = require("lodash")

const moment = require("moment")

class ProjectController {
  /**
   * Show all projects
   *
   * @param {Context} ctx
   */
  async index({ auth }) {
    const user = await auth.getUser()
    return await user.projects().fetch()
  }

  /**
   * Create a new project
   *
   * @param {Context} ctx
   */
  async create({ request, auth }) {
    let user = await auth.getUser()
    let { name } = request.all()
    let project = new Project()

    project.fill({
      name: name
    })

    await user.projects().save(project)
    return project
  }

  /**
   * Get details about the selected project
   *
   * @param {Context} ctx
   */
  async show({ request, auth, params }) {}

  /**
   * Edits a projects details
   *
   * @param {Context} ctx
   */
  async update({ request, response, auth, params }) {
    let user = await auth.getUser()
    let { id } = params
    let project = await Project.find(id)

    if (!(await project.canBeEditedBy(user))) {
      return response.status(403).json({
        error:
          "User(" +
          _.capitalize(user.username) +
          ") is not permitted to update project(" +
          _.capitalize(project.name) +
          ")"
      })
    }

    project.merge(request.only("name"))

    await project.save()
    return project
  }

  /**
   * Deletes a project
   *
   * @param {Context} ctx
   */
  async delete({ request, response, auth, params }) {
    let user = await auth.getUser()
    let { id } = params
    let project = await Project.find(id)

    if (await project.canBeEditedBy(user)) {
      return response.status(403).json({
        error:
          "User(" +
          _.capitalize(user.username) +
          ") is not permitted to delete project(" +
          _.capitalize(project.name) +
          ")"
      })
    }

    project.deleted_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let success = await project.save()

    return {
      success: success,
      data: project
    }
  }
}

module.exports = ProjectController
