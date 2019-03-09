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

  getTasks(projectId) {
    this.loading(true)

    const response = axios
      .get(`/api/v1/projects/${projectId}/tasks`)
      .then((response) => {
        $('[data-task-id]').remove()
        response.data.data.forEach((task, index) => {
          this.appendTask(task)
        })
      })

    this.loading(false)
  }

  getStagesAndTheirTasks(projectId) {
    this.loading(true)

    const response = axios
      .get(`/api/v1/projects/${projectId}/stages`)
      .then((response) => {
        $('main').html('')
        console.log(response)
      })

    this.loading(false)
  }

  appendProject(project) {
    let newProjectEle = $('[data-cloneable="project-li"]')
      .clone()
      .attr('data-cloneable', false)
      .attr('data-project-id', project.id)
      .text(function() {
        window.yerd = project
        return $(this)
          .text()
          .replace('{{project.name}}', project.name)
      })
      .click(() => {
        this.getStagesAndTheirTasks(project.id)
      })

    newProjectEle.appendTo('[data-project-ul]').fadeIn(200)
  }

  appendTask(task) {
    let newProjectEle = $('[data-cloneable="task-li"]')
      .clone()
      .attr('data-cloneable', false)
      .attr('data-task-id', task.id)
      .text(function() {
        return $(this)
          .text()
          .replace('{{task.name}}', task.name)
      })

    newProjectEle.appendTo('[data-task-ul]').fadeIn(200)
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
