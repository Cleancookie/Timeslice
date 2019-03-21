'use strict'
/** @type {typeof import('App/Models/Project')} */
const Project = use('App/Models/Project')
/** @type {typeof import('App/Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Database')} */
const Database = use('Adonis/Src/Database')
/** @type {typeof import('lodash')} */
const _ = require('lodash')

const moment = require('moment')

class ProjectController {
  /**
   * Show all projects
   *
   * @param {Context} ctx
   */
  async index({ auth }) {
    const user = await auth.getUser()
    const projects = await user
      .projects()
      .orderBy('name')
      .where('deleted_at', null)
      .fetch()

    return {
      success: true,
      data: projects
    }
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

    const success = await user.projects().save(project)

    if (!success) {
      // TODO: check if project actually saved or has validation errors
    }

    return {
      success: true,
      data: project
    }
  }

  /**
   * Get details about the selected project
   *
   * @param {Context} ctx
   */
  async show({ request, response, auth, params }) {
    const { id } = request.params
    let project = await Project.find(id)
    project = await Project.query()
      .where({ id: id })
      .with('projects')
      .with('users')
      .fetch()

    if (!project) {
      response.status(404)
      return {
        success: false,
        error: '404',
        message: `Project(${id}) not found`
      }
    }

    return {
      success: true,
      data: project
    }
  }

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
        success: false,
        error: 403,
        message: `User(${user.username}) could not update project(${
          project.name
        })`
      })
    }

    project.merge(request.only('name'))
    const success = await project.save()

    if (!success) {
      // TODO check for validation errors
    }

    return {
      success: success,
      data: project
    }
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

    // if (await project.canBeEditedBy(user)) {
    //   return response.status(403).json({
    //     success: false,
    //     error: 403,
    //     message: `User(${user.username}) could not delete project(${
    //       project.name
    //     })`
    //   })
    // }

    project.deleted_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let success = await project.save()

    if (!success) {
      // TODO: Check for errors
    }

    return {
      success: success,
      data: project
    }
  }

  /**
   * Edit members attached to a project
   *
   * @param {Context} ctx
   */
  async editMembers({ request, response, params }) {
    const { id } = params
    const { newUsers } = request.all()
    const project = await Project.find(id)
    const result = await project.users().sync(newUsers)

    return response.json({
      success: true,
      data: result
    })
  }
}

module.exports = ProjectController
