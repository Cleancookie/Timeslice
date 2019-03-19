'use strict'
// Dependencies
const $ = require('jquery')
const _ = require('lodash')
const axios = require('axios')
const animations = require('./animations')

export default class CreateProjectModalComponent {
  constructor() {
    this.newProjectListener()
  }

  newProjectListener() {
    // Submit button
    $('[data-create-project-form]').submit(async (e) => {
      e.preventDefault()
      animations.loading(true)

      let name = $(e.currentTarget)
        .find('[data-create-project-name]')
        .val()
      // let userIds = $(e.currentTarget)
      //   .find('[data-create-project-users]')
      //   .val()

      await axios.post(`/api/v1/projects`, {
        name: name
      })

      animations.loading(false)
    })

    // Autocomplete users pillbox
    $('[data-create-project-users]').select2({
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
    })
  }
}
