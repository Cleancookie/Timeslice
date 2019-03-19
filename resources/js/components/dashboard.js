const axios = require('axios')
const _ = require('lodash')

export default class DashboardComponent {
  constructor(init = true) {
    if ($('[data-dashboard]').length) {
      this.loadingCounter = 0

      if (init) {
        this.getAppProjects()
        this.attachEditProjectTitle()
        this.createProjectListener()
      }

      console.log('Dashboard loaded')
      this.modalInit = false
    }
  }

  getAppProjects() {
    this.loading(true)
    let response = axios.get('/api/v1/projects').then((response) => {
      response.data.data.forEach((project) => {
        this.appendProject(project)
      })
      this.loading(false)
    })
  }

  loadProject(projectId) {
    this.loading(true)

    $('.project--container__active').removeClass('project--container__active')

    $(`[data-project-id=${projectId}]`).addClass('project--container__active')
    $('[data-project-name]').text(
      $(`[data-project-id=${projectId}]`)
        .find('h2')
        .text()
    )
    $('[data-project-name]').fadeIn(200)

    $('[data-stage-ul]')
      .find('[data-cloneable="false"]')
      .fadeOut(200)

    // Init edit project member modal
    axios.get(`/api/v1/projects/${projectId}`).then((response) => {
      this.initEditProjectModal(response.data.data)
    })

    axios.get(`/api/v1/projects/${projectId}/stages`).then((response) => {
      // Clear the dashboard's stages
      $('[data-stage-ul]')
        .find('[data-cloneable="false"]')
        .remove()

      projectUsers = response.data.users.map((user) => {
        return user.username
      })

      response.data.data.forEach((stage) => {
        this.appendStage(stage)
      })
    })

    this.loading(false)
  }

  appendProject(project) {
    let newProjectEle = this.createProjectLi(project)

    newProjectEle.appendTo('[data-project-ul]').fadeIn(200)
  }

  createProjectLi(project) {
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
        this.loadProject(project.id)
      })

    return newProjectEle
  }

  appendStage(stage) {
    let newStageEle = this.createStageLi(stage)

    newStageEle.appendTo('[data-stage-ul]')
    this.appendTasksToStage(newStageEle, stage.tasks)

    newStageEle.fadeIn(200)
  }

  createStageLi(stage) {
    let newStageEle = $('[data-cloneable="stage-li"]')
      .clone()
      .attr('data-cloneable', false)
      .attr('data-stage-id', stage.id)
      .html(function() {
        return $(this)
          .html()
          .replace('{stage.name}', stage.name)
      })

    return newStageEle
  }

  appendTasksToStage(stageEle, tasks) {
    // Delete all old tasks
    $(stageEle)
      .find('[data-cloneable="false"]')
      .remove()

    tasks.forEach((task) => {
      let newTaskEle = this.createTaskLiInStage(task, stageEle)

      newTaskEle.appendTo($(stageEle).find('[data-task-ul]'))
      newTaskEle.fadeIn(200)
    })
  }

  createTaskLiInStage(task, stageEle) {
    let newTaskEle = $(stageEle)
      .find('[data-cloneable="task-li"]')
      .clone()
      .attr('data-cloneable', false)
      .attr('data-task-li-id', task.id)
      .html(function() {
        return $(this)
          .html()
          .replace('{task.name}', task.name)
          .replace('{task.users.username}', task.users.username)
          .replace('{task.description}', task.description)
      })

    newTaskEle.find('form').attr('data-task-id', task.id)

    // Init Autocomplete for usernames
    newTaskEle.find('[data-task-input-user]').autocomplete({
      source: projectUsers,
      delay: 50
    })

    this.attachTaskToolbarListeners(newTaskEle)
    this.attachTaskFormListener($(newTaskEle).find('form'))

    return newTaskEle
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
        const user = $(formEl)
          .find('[data-task-input-user]')
          .val()

        // Post to API
        const response = axios.post(`/api/v1/tasks/${taskId}`, {
          id: taskId,
          name: name,
          user: user,
          description: description
        })

        response
          .then((res) => {
            if (_.get(res, 'data.success') != true) {
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
      const btnDelete = $('#delete-task--modal').find(
        '[data-delete-task-button]'
      )

      btnDelete.click(() => {
        this.loading(true)
        const taskId = btnDelete.data('delete-task-id')
        const response = axios.post(`/api/v1/tasks/${taskId}/delete`)
        response
          .then((res) => {
            this.loading(false)
            if (res.data.success != true) {
              alert('Could not delete task!')
              return
            }

            // Delete task div
            $('#delete-task--modal').modal('hide')
            $(`[data-task-li-id="${taskId}"]`).addClass('bounceOut animated')
            $(`[data-task-li-id="${taskId}"]`).on('animationend', () => {
              $(`[data-task-li-id="${taskId}"]`).remove()
            })
          })
          .catch((err) => {
            this.loading(false)
            alert('Could not delete task!')
          })
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

  createProjectListener() {
    // Submit button
    $('[data-create-project-form]').submit(async (e) => {
      e.preventDefault()
      this.loading(true)

      let name = $(e.currentTarget)
        .find('[data-create-project-name]')
        .val()

      let res = await axios.post(`/api/v1/projects`, {
        name: name
      })

      $('#new-project--modal').modal('hide')

      this.appendProject(res.data.data)

      // Select the new project
      this.loadProject(res.data.data.id)
      $('[data-project-name]').text(res.data.data.name)
      $('[data-project-name]').fadeIn(200)

      $('[data-sidebar]').animate(
        {
          scrollTop: $(`[data-project-id=${res.data.data.id}]`).offset().top
        },
        1000
      )

      this.loading(false)
    })
  }

  initEditProjectModal(project) {
    $('[data-edit-members-button]').click(async (e) => {
      // Show modal
      $('#edit-users-in-project--modal').modal('show')
    })

    // Add all assigned users as already selected options
    let currentMembers = project[0].users.map((user) => {
      return {
        id: user.id,
        text: user.username,
        selected: true
      }
    })

    // Setup select2 options
    let select2Config = {
      multiple: true,
      data: currentMembers,
      width: '100%',
      minimumInputLength: 1,
      ajax: {
        url: '/api/v1/users',
        dataType: 'json',
        processResults: function(res) {
          let users = res.data.map((user) => {
            return {
              id: user.id,
              text: user.username
            }
          })

          return { results: users }
        }
      }
    }

    // Autocomplete pillbox with assigned users already filled in
    if (
      $('[data-create-project-users]').hasClass('select2-hidden-accessible')
    ) {
      // Re-init the selected options
      let newCurrentMembers = currentMembers.map((opt) => {
        return opt.id
      })
      $('[data-create-project-users]')
        .val(newCurrentMembers)
        .trigger('change')
    } else {
      // init select2
      $('[data-create-project-users]').select2(select2Config)
    }
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
