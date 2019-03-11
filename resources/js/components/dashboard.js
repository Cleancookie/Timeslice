const axios = require('axios')
const _ = require('lodash')

export default class DashboardComponent {
  constructor() {
    if ($('[data-dashboard]').length) {
      this.loadingCounter = 0
      this.getAppProjects()
      this.attachEditProjectTitle()
      console.log('Dashboard loaded')
      this.modalInit = false
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

    newStageEle.appendTo('[data-stage-ul]')
    this.appendTasksToStage(newStageEle, stage.tasks)

    newStageEle.fadeIn(200)
  }

  appendTasksToStage(stageEle, tasks) {
    // Delete all old tasks
    $(stageEle)
      .find('[data-cloneable="false"]')
      .remove()

    tasks.forEach((task) => {
      let newTaskEle = $(stageEle)
        .find('[data-cloneable="task-li"]')
        .clone()
        .attr('data-cloneable', false)
        .attr('data-task-li-id', task.id)
        .html(function() {
          return $(this)
            .html()
            .replace('{task.name}', task.name)
            .replace('{task.user}', task.users.username)
            .replace('{task.description}', task.description)
        })

      newTaskEle.find('form').attr('data-task-id', task.id)
      this.attachTaskToolbarListeners(newTaskEle)
      this.attachTaskFormListener($(newTaskEle).find('form'))
      newTaskEle.appendTo($(stageEle).find('[data-task-ul]'))
      newTaskEle.fadeIn(200)
    })
  }

  attachTaskFormListener(formEl) {
    $(formEl).submit((e) => {
      e.preventDefault()
    })

    // Submit on submit button
    $(formEl)
      .closest('[data-task-li]')
      .find('[data-toolbar-submit]')
      .click(() => {
        this.loading(true)

        // Get values from fields
        const taskId = $(formEl).data('task-id')
        const name = $(formEl)
          .find('input[name=name]')
          .val()
        const description = $(formEl)
          .find('[data-task-description]')
          .val()

        // Post to API
        const response = axios.post(`/api/v1/tasks/${taskId}`, {
          id: taskId,
          name: name,
          description: description
        })

        response
          .then((res) => {
            if (_.get(res, 'data.success') != true) {
              console.log(res)
              const check = formEl
                .closest('[data-task-li]')
                .find('[data-toolbar-submit]')
              check.addClass('animated shake error')
              check.on('animationend', function() {
                check.removeClass('animated shake error')
              })
            } else {
              console.log('Task updated')
              const el = $(`[data-task-li-id="${taskId}"]`)
              // Toggle toolbar
              el.find('[data-task-toolbar-tools]').fadeOut(100)

              // Material guidelines shadow
              el.removeClass('task-toolbar--container__active')

              // Toggle disabled on fields
              el.find('[data-task-input]').attr('disabled', (i, v) => {
                return !v
              })
            }
            this.loading(false)
          })
          .catch((err) => {
            alert('Could not update task.')
            this.loading(false)
          })
      })
  }

  attachTaskToolbarListeners(el) {
    // Hide / show cog
    el.hover(
      () => {
        $(el)
          .find('[data-task-toolbar-container]')
          .slideDown(100)
      },
      () => {
        $(el)
          .find('[data-task-toolbar-container]')
          .slideUp(100)
      }
    )

    // Hide / show toolbar
    el.find('[data-task-toolbar-toggle]').click(() => {
      // Toggle toolbar
      $(el)
        .find('[data-task-toolbar-tools]')
        .fadeToggle(100)

      // Material guidelines shadow
      $(el).toggleClass('task-toolbar--container__active')

      // Make cog spin
      $(el)
        .find('[data-task-toolbar-toggle]')
        .find('i')
        .toggleClass('spin')

      // Toggle disabled on fields
      $(el)
        .find('[data-task-input]')
        .attr('disabled', (i, v) => {
          return !v
        })
    })

    // Show modal to delete task
    $(el)
      .find('[data-toolbar-delete]')
      .click(() => {
        const taskId = $(el).data('task-li-id')
        $('#delete-task--modal')
          .find('[data-delete-task-button]')
          .data('delete-task-id', taskId)
        $('#delete-task--modal').modal('show')
      })

    // Delete task modal
    if (!this.modalInit) {
      $('#delete-task--modal')
        .find('[data-delete-task-button]')
        .click(function() {
          const taskId = $(this).data('delete-task-id')
          console.log(taskId)
          // TODO send delete request based on this id
        })

      this.modalInit = true
    }
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
      this.loadingCounter++
    } else {
      this.loadingCounter--
    }

    if (this.loadingCounter == 0) {
      setTimeout(() => {
        $('[data-loading-bar]').fadeOut(200)
      }, 350)
    } else {
      $('[data-loading-bar]').fadeIn(200)
    }
  }
}
