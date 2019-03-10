const axios = require('axios')

class Dashboard {
  constructor() {
    if ($('[data-dashboard]').length) {
      console.log('Dashboard loaded')
      this.getAppProjects()
    }
  }

  getAppProjects() {
    this.loading(true)
    const response = axios.get('/api/v1/projects').then((response) => {
      response.data.data.forEach((project) => {
        this.appendProject(project)
      })
    })
    this.loading(false)
  }

  getStagesAndTheirTasks(projectId) {
    this.loading(true)

    const response = axios
      .get(`/api/v1/projects/${projectId}/stages`)
      .then((response) => {
        // Clear the dashboard's stages
        $('[data-stage-ul]')
          .find('[data-cloneable="false"]')
          .remove()

        response.data.data.forEach((stage) => {
          this.appendStage(stage)
        })
      })

    this.loading(false)
  }

  appendProject(project) {
    let newProjectEle = $('[data-cloneable="project-li"]')
      .clone()
      .attr('data-cloneable', false)
      .attr('data-project-id', project.id)
      .html(function() {
        return $(this)
          .html()
          .replace('{project.name}', project.name)
      })
      .click(() => {
        this.getStagesAndTheirTasks(project.id)
      })

    newProjectEle.appendTo('[data-project-ul]').fadeIn(200)
  }

  appendStage(stage) {
    let newStageEle = $('[data-cloneable="stage-li"]')
      .clone()
      .attr('data-cloneable', false)
      .attr('data-stage-id', stage.id)
      .html(function() {
        return $(this)
          .html()
          .replace('{stage.name}', stage.name)
      })
      .click(() => {
        console.log(`Click on ${stage.name}(${stage.id})`)
      })

    newStageEle.appendTo('[data-stage-ul]')
    newStageEle.data.stage = stage
    this.refreshStagesTasks(newStageEle)
    newStageEle.fadeIn(200)
  }

  refreshStagesTasks(stageEle) {
    stageEle.data.stage.tasks.forEach((task) => {
      let newTaskEle = $(stageEle)
        .find('[data-cloneable="task-li"]')
        .clone()
        .attr('data-cloneable', false)
        .attr('data-task-id', task.id)
        .html(function() {
          return $(this)
            .html()
            .replace('{task.name}', task.name)
        })
        .click(() => {
          console.log(`Click on ${task.name}(${task.id})`)
        })

      newTaskEle.appendTo($(stageEle))
      newTaskEle.data.task = task
      newTaskEle.fadeIn(200)
    })
  }

  loading(isLoading) {
    if (isLoading) {
      $('[data-loading-bar]').fadeIn(200)
    } else {
      $('[data-loading-bar]').fadeOut(200)
    }
  }
}

module.exports = new Dashboard()
