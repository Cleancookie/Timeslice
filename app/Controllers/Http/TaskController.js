'use strict'

const moment = require('moment')

/** @type {typeof import('App/Models/Project')} */
const Project = use('App/Models/Project')
/** @type {typeof import('App/Models/Task')} */
const Task = use('App/Models/Task')
/** @type {typeof import('App/Models/User')} */
const User = use('App/Models/User')

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
      .where('deleted_at', null)
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
    let { name, description, project_id, stage_id, user_id } = request.all()
    let { id } = params
    let project = await Project.find(id)

    // if (!(await project.canBeEditedBy(user))) {
    //   response.status(403)
    //   return {
    //     success: false,
    //     error: 403,
    //     message: `User(${user.username}) is not permitted to update project(${
    //       project.name
    //     })`
    //   }
    // }

    if (!user_id) {
      user_id = user.id
    }

    let task = new Task()
    task.fill({
      name: name,
      description: description,
      project_id: project_id,
      stage_id: stage_id,
      user_id: user_id
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
    let { name, description, user: username } = request.all()
    let task = await Task.find(id)

    // find user with username
    let newUser = await User.findBy('username', username)

    task.merge({
      name: name,
      description: description,
      user_id: newUser.id
    })

    const success = await task.save()
    return {
      success: success,
      data: task
    }
  }

  async updateUser({ request, response, auth, params }) {
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

  async updateStage({ request, response, auth, params }) {
    const { stageId } = request.all()
    const { id } = params
    let task = await Task.find(id)

    task.stage_id = stageId

    const success = await task.save()

    if (!success) {
      response.status(403)
      return {
        success: false,
        error: 403,
        message: 'Could not update stage'
      }
    }

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
    let { id } = params
    let task = await Task.find(id)

    task.deleted_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let success = await task.save()

    return {
      success: success,
      data: task
    }
  }

  async nextStage({ request, response, auth, params }) {
    let { id } = params
    let task = await Task.find(id)

    return response.json(await task.nextStage())
  }

  /**
   * Returns all users for select2
   *
   * @param {Context} ctx
   */
  async assignableUsers({ request, params }) {
    const { id } = params
    const task = await Task.find(id)
    const project = await task.projects().fetch()
    const users = await project.users().fetch()
    return users
  }
}

module.exports = TaskController
