'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
/** @type {typeof import('App/Models/Stage')} */
const Stage = use('App/Models/Stage')

const { LogicalException } = require('@adonisjs/generic-exceptions')

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

        if (!newStage) {
          const message = `${stage.order} is not a valid stage order.`
          const status = 500
          const code = 'E_INVALID_NEW_STAGE'
          throw new LogicalException(message, status, code)
        }

        return newStage
      })
    return newStage
  }

  prevStage() {
    let prevStage = this.stages()
      .fetch()
      .then((stage) => {
        let prevStageOrderPos = stage.order - 1

        let prevStage = Stage.query()
          .where('project_id', this.project_id)
          .where('order', newStageOrderPos)
          .fetch()

        if (!prevStage) {
          const message = `${stage.order} is not a valid stage order.`
          const status = 500
          const code = 'E_INVALID_NEW_STAGE'
          throw new LogicalException(message, status, code)
        }

        return prevStage
      })
    return prevStage
  }
}

module.exports = Task
