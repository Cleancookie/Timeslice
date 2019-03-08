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
      window.yerd = response
      response.data.data.forEach((project) => {
        $('[data-cloneable="project-li"]')
          .clone()
          .attr('data-cloneable', false)
          .text(function() {
            return $(this)
              .text()
              .replace('{{project.name}}', project.name)
          })
          .appendTo('[data-project-ul]')
          .show()
      })
    })
  }
}

module.exports = new Dashboard()
