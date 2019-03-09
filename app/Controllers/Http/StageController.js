'use strict'

/** @type {typeof import('App/Models/Project')} */
const Project = use('App/Models/Project')
/** @type {typeof import('App/Models/Stage')} */
const Stage = use('App/Models/Stage')

class StageController {
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

    const stages = await Stage.query()
      .where('project_id', project.id)
      .where('deleted_at', null)
      .orderBy('order')
      .fetch()

    return {
      success: true,
      model: 'Stage',
      data: stages
    }
  }
}

module.exports = StageController
