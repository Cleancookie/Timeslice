'use strict'
// Dependencies
const $ = require('jquery')
const _ = require('lodash')

export default class CreateProjectComponent {
  constructor() {
    this.newProjectListener()
  }

  newProjectListener() {
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
