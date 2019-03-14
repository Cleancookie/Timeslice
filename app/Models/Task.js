'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
/** @type {typeof import('App/Models/Stage')} */
const Stage = use('App/Models/Stage')

class Task extends Model {
  projects() {
    return this.belongsTo('App/Models/Project')
  }

  stages() {
    return this.belongsTo('App/Models/Stage')
  }

  users() {
    return this.belongsTo('App/Models/User')
  }

  nextStage() {
    let newStage = this.stages()
      .fetch()
      .then((stage) => {
        let newStageOrderPos = stage.order + 1

        let newStage = Stage.query()
          .where('project_id', this.project_id)
          .where('order', newStageOrderPos)
          .fetch()

        return newStage
      })
    return newStage
  }

  prevStage() {
    let prevStage = this.stages()
      .fetch()
      .then((stage) => {
        let prevStageOrderPos = stage.order + 1

        let prevStage = Stage.query()
          .where('project_id', this.project_id)
          .where('order', newStageOrderPos)
          .fetch()

        return prevStage
      })
    return prevStage
  }
}

module.exports = Task
