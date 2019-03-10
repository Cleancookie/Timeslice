const axios = require('axios')

class Dashboard {
  constructor() {
    if ($('[data-dashboard]').length) {
      console.log('Dashboard loaded')
      this.getAppProjects()
      this.attachEditProjectTitle()
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
        $('.project--container__active').removeClass(
          'project--container__active'
        )
        $('[data-project-name]').text(project.name)
        $('[data-project-name]').fadeIn(200)
        $(newProjectEle).addClass('project--container__active')
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

    // From https://stackoverflow.com/questions/43173936/using-flexbox-with-jqueryuis-sortable
    const placeholderElement = jQuery(
      '<div style="background-color: #eee;"></div>'
    )
    $('.connectedSortable')
      .sortable({
        connectWith: '.connectedSortable',
        activate: function(event, ui) {
          placeholderElement.insertBefore(ui.item[0])

          // Explicitly set the height and width to preserve
          // flex calculations
          placeholderElement.width(ui.item[0].offsetWidth)
          placeholderElement.height(ui.item[0].offsetHeight)
        },

        // Remove it when you're done dragging.
        deactivate: function() {
          placeholderElement.remove()
        }
      })
      .disableSelection()
    newStageEle.fadeIn(200)
  }

  refreshStagesTasks(stageEle) {
    // Delete all old tasks
    $(stageEle)
      .find('[data-cloneable="false"]')
      .remove()

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
            .replace('{task.user}', task.users.username)
            .replace('{task.description}', task.description)
        })
        .click(() => {
          console.log(`Click on ${task.name}(${task.id})`)
        })

      newTaskEle.appendTo($(stageEle).find('[data-task-ul]'))
      newTaskEle.data.task = task
      newTaskEle.fadeIn(200)
    })
  }

  attachEditProjectTitle() {
    $('[data-project-name]').click(function() {
      $(this).hide()
      $('[data-project-name-input]').val($(this).text())
      $('[data-project-name-input]').show()
      $('[data-project-name-input]').focus()
    })

    $('[data-project-name-input]').focusout(function() {
      $(this).hide()
      $('[data-project-name]').show()
    })

    $('[data-project-name-form]').submit(async (e) => {
      e.preventDefault()
      this.loading(true)

      const newName = $('[data-project-name-input]').val()
      const projectId = $('.project--container__active').attr('data-project-id')

      try {
        const res = await axios.post(`/api/v1/projects/${projectId}`, {
          name: newName
        })

        $('[data-project-name]').text(res.data.data.name)
        $(`[data-project-id="${res.data.data.id}"]`)
          .find('h2')
          .text(res.data.data.name)
      } catch (err) {
        alert('Could not update project name')
      }

      $('[data-project-name-input]').hide()
      $('[data-project-name]').show()
      this.loading(false)
    })
  }

  loading(isLoading) {
    if (isLoading) {
      $('[data-loading-bar]').fadeIn(200)
    } else {
      setTimeout(() => {
        $('[data-loading-bar]').fadeOut(200)
      }, 350)
    }
  }
}

module.exports = new Dashboard()
