'use strict'

/** @type {typeof import('App/Models/Project')} */
const Project = use("App/Models/Project")
/** @type {typeof import('App/Models/Project')} */
const Task = use("App/Models/Task")

class TaskController {
  async index({ auth, params }) {
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

    return await project.tasks().fetch()
  }

  /**
   * Create a new task for a given project
   *
   * @param {Context} ctx
   */
  async create({ request, auth, params }) {
    let user = await auth.getUser()
    let { name, description } = request.all()
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

    let task = new Task()
    task.fill({
      name: name,
      description: description
    })
    await project.tasks().save(task)

    return task
  }
}

module.exports = TaskController
