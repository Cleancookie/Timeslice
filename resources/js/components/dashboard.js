const axios = require('axios')

class Dashboard {
  constructor() {
    if ($('[data-dashboard]').length) {
      console.log('Dashboard loaded')
      this.getAppProjects()
    }
  }

  getAppProjects() {
    const response = axios.get('/api/v1/projects').then((response) => {
      response.data.data.forEach((project) => {
        this.appendProject(project)
      })
    })
  }

  getTasks(projectId) {
    const response = axios
      .get(`/api/v1/projects/${projectId}/tasks`)
      .then((response) => {
        $('[data-task-id]').remove()
        response.data.data.forEach((task) => {
          this.appendTask(task)
        })
      })
  }

  appendProject(project) {
    let newProjectEle = $('[data-cloneable="project-li"]')
      .clone()
      .attr('data-cloneable', false)
      .attr('data-project-id', project.id)
      .text(function() {
        return $(this)
          .text()
          .replace('{{project.name}}', project.name)
      })
      .click(() => {
        this.getTasks(project.id)
      })

    newProjectEle.appendTo('[data-project-ul]').show()
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

    newProjectEle.appendTo('[data-task-ul]').show()
  }
}

module.exports = new Dashboard()
