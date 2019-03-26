const axios = require('axios')
const _ = require('lodash')
const delay = require('delay')

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
    $('[data-project-toolbar-container]').fadeIn(200)

    $('[data-stage-ul]')
      .find('[data-cloneable="false"]')
      .fadeOut(200)

    axios.get(`/api/v1/projects/${projectId}`).then((response) => {
      // Init edit project member modal
      this.initEditProjectModal(response.data.data[0])

      // Init delete project modal
      this.initDeleteProjectModal(response.data.data[0])
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

    this.attachStageToolbarListeners(newStageEle)

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

  attachStageToolbarListeners(el) {
    el.find('[data-stage-toolbar-new-task-button]').click((e) => {
      e.preventDefault()
      const stageId = el.attr('data-stage-id')
      $('#new-task--modal')
        .find('[data-create-task-form]')
        .attr('data-stage-id', stageId)

      $('[data-create-task-form]').unbind('submit')
      $('[data-create-task-form]').submit(async (e) => {
        e.preventDefault()
        this.loading(true)
        const stageId = $('[data-create-task-form]').attr('data-stage-id')
        const projectId = $('.project--container__active').attr(
          'data-project-id'
        )
        const name = $('[data-create-task-name]').val()
        const description = $('[data-create-task-description]').val()
        const username = $('[data-create-task-user]').val()

        const response = await axios.post(
          `/api/v1/projects/${projectId}/tasks`,
          {
            stage_id: stageId,
            project_id: projectId,
            name,
            description,
            username
          }
        )

        $('#new-task--modal').modal('hide')

        const newTaskEle = this.createTaskLiInStage(
          response.data.data[0],
          $(`[data-stage-id=${stageId}]`)
        )

        newTaskEle.appendTo(
          $(`[data-stage-id=${stageId}]`).find('[data-task-ul]')
        )
        newTaskEle.fadeIn(200)

        // Scroll to new task
        $(`[data-stage-id=${stageId}]`).animate(
          {
            scrollLeft: $(newTaskEle).offset().left
          },
          1000
        )

        this.loading(false)
      })

      // Init autocomplete on assigned user box
      $('#new-task--modal')
        .find('[data-create-task-user]')
        .autocomplete({
          source: projectUsers,
          delay: 50
        })
      $('#new-task--modal').modal('show')
      $('#new-task--modal').unbind('shown.bs.modal')
      $('#new-task--modal').on('shown.bs.modal', (e) => {
        $('[data-create-task-name]').focus()
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

    // Move task from stage to stage
    el.find('[data-toolbar-prev]').click(async (e) => {
      this.loading(true)
      try {
        const taskId = $(e.currentTarget)
          .closest('[data-task-li]')
          .attr('data-task-li-id')
        const response = await axios.post(`/api/v1/tasks/${taskId}/prev-stage`)
        this.loading(false)
        const taskLi = $(`[data-task-li-id=${taskId}]`)
        taskLi.addClass('animated bounceOutUp')
        await delay(700)
        taskLi.hide()
        taskLi.appendTo(
          `[data-stage-id=${response.data.newStage[0].id}] [data-task-ul]`
        )
        taskLi.show()
        taskLi.removeClass('bounceOutUp')
        taskLi.addClass('bounceInUp')
        await delay(700)
        taskLi.removeClass('animated bounceInUp')
      } catch (e) {
        alert('Could not update task')
        console.log(e)
        this.loading(false)
      }
    })

    el.find('[data-toolbar-next]').click(async (e) => {
      this.loading(true)
      try {
        const taskId = $(e.currentTarget)
          .closest('[data-task-li]')
          .attr('data-task-li-id')
        const response = await axios.post(`/api/v1/tasks/${taskId}/next-stage`)
        this.loading(false)
        const taskLi = $(`[data-task-li-id=${taskId}]`)
        taskLi.addClass('animated bounceOutDown')
        await delay(700)
        taskLi.hide()
        taskLi.appendTo(
          `[data-stage-id=${response.data.newStage[0].id}] [data-task-ul]`
        )
        taskLi.show()
        taskLi.removeClass('bounceOutDown')
        taskLi.addClass('bounceInDown')
        await delay(700)
        taskLi.removeClass('animated bounceInDown')
      } catch (e) {
        alert('Could not update task')
        console.log(e)
        this.loading(false)
      }
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
      $('[data-project-toolbar-container]').show(200)

      $('[data-sidebar]').animate(
        {
          scrollTop: $(`[data-project-id=${res.data.data.id}]`).offset().top
        },
        1000
      )

      this.loading(false)
    })
  }

  initDeleteProjectModal(project) {
    $('[data-delete-project]').click(async (e) => {
      console.log('clicked')
      console.log(project)
      $('[data-delete-project-confirm-button]').attr(
        'data-delete-project-id',
        project.id
      )
      $('#delete-project--modal').modal('show')
    })

    $('[data-delete-project-confirm-button]').click(async (e) => {
      this.loading(true)
      const projectId = $(e.currentTarget).data('delete-project-id')
      const response = await axios.post(`/api/v1/projects/${projectId}/delete`)
      this.loading(false)
      if (response) {
        // Hide everything!!
        $('[data-project-toolbar-container]').hide()
        $('[data-stage-ul]')
          .find('[data-cloneable=false]')
          .remove()
        $('.project--container__active').remove()
        $('#delete-project--modal').modal('hide')
      } else {
        alert('There was an error, please try again later!')
      }
    })
  }

  initEditProjectModal(project) {
    $('[data-edit-members-button]').click(async (e) => {
      // Show modal
      $('#edit-users-in-project--modal').modal('show')
    })

    $('[data-edit-members-form]').unbind('submit')
    $('[data-edit-members-form]').submit(async (e) => {
      e.preventDefault()
      this.loading(true)
      const newUsers = $('[data-edit-members--select]').val()
      const projectId = $('.project--container__active').data('project-id')

      const response = await axios.post(
        `/api/v1/projects/${projectId}/members`,
        { newUsers }
      )
      this.loading(false)

      if (response.status == 200) {
        $('#edit-users-in-project--modal').modal('hide')
      }
    })

    // Add all assigned users as already selected options
    let currentMembers = project.users.map((user) => {
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
      $('[data-edit-members--select]').hasClass('select2-hidden-accessible')
    ) {
      // Re-init the selected options
      let newCurrentMembers = currentMembers.map((opt) => {
        return opt.id
      })
      $('[data-edit-members--select]')
        .val(newCurrentMembers)
        .trigger('change')
    } else {
      // init select2
      $('[data-edit-members--select]').select2(select2Config)
    }
  }

  async loading(isLoading) {
    if (isLoading) {
      this.loadingCounter++
    } else {
      this.loadingCounter--
    }

    if (this.loadingCounter <= 0) {
      await delay(300)
      $('[data-loading-bar]').fadeOut(200)
    } else {
      $('[data-loading-bar]').fadeIn(200)
    }
  }
}
