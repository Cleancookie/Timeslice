'use strict'

const moment = require('moment')

/** @type {typeof import('App/Models/Project')} */
const Project = use('App/Models/Project')
/** @type {typeof import('App/Models/Task')} */
const Task = use('App/Models/Task')

class TaskController {
  /**
   * Show all tasks in a project
   *
   * @param {Context} ctx
   */
  async index({ auth, params }) {
    let user = await auth.getUser()
    let { id } = params
    let project = await Project.find(id)

    if (!(await project.canBeEditedBy(user))) {
      response.status(403)
      return {
        success: false,
        error: 403,
        message: `Could not find project(${project.name})`
      }
    }
    const tasks = await project
      .tasks()
      .with('users')
      .with('stages')
      .fetch()

    return {
      success: true,
      data: tasks
    }
  }

  /**
   * Gets all details about a task
   *
   * @param {Context} ctx
   */
  async show({ request, response, auth, params }) {
    let { id } = request.params

    let task = await Task.find(id)
    task = await Task.query()
      .where('id', id)
      .with('stages')
      .with('users')
      .fetch()

    return {
      success: true,
      data: task
    }
  }

  /**
   * Create a new task for a given project
   *
   * @param {Context} ctx
   */
  async create({ request, auth, params }) {
    let user = await auth.getUser()
    let { name, description, project_id, stage_id } = request.all()
    let { id } = params
    let project = await Project.find(id)

    if (!(await project.canBeEditedBy(user))) {
      response.status(403)
      return {
        success: false,
        error: 403,
        message: `User(${user.username}) is not permitted to update project(${
          project.name
        })`
      }
    }

    let task = new Task()
    task.fill({
      name: name,
      description: description,
      project_id: project_id,
      stage_id: stage_id
    })

    const success = await project.tasks().save(task)

    return {
      success: success,
      data: task
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
    let task = await Task.find(id)

    task.merge(request.only(['name', 'description', 'stage_id']))

    const success = await task.save()
    return {
      success: success,
      data: task
    }
  }

  async reassignUser({ request, response, auth, params }) {
    // const user = await auth.getUser()
    const { userId } = request.all()
    const { id } = params
    let task = await Task.find(id)
    task.user_id = userId
    const success = await task.save()
    return {
      success: success,
      data: task
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
    let task = await Task.find(id)

    task.deleted_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let success = await task.save()

    return {
      success: success,
      data: task
    }
  }
}

module.exports = TaskController
