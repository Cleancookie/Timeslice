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
      let cards = response.data.data.map((project) => {
        console.log(project.name)
      })
    })
  }
}

module.exports = new Dashboard()
