'use strict'
import $ from 'jquery'
import axios from 'axios'

export default class ProjectComponent {
  constructor() {

  }

  init() {
    $(document).ready(function() {
      $('[data-create-project]').on('click', function() {
        $('[data-create-project-form]').toggle()
      })

      $('[data-create-project-form]').on('submit', (function(event) {
        $('[data-create-project-name]').attr('disabled', true)
        $('[data-create-project-submit]').text('Saving...')
        event.preventDefault();
        axios.post('/projects/store', {
          name: $('[data-create-project-name]').val()
        }).then(function(res) {
          $('[data-create-project-form]').hide()
          $('[data-create-project-name]').attr('disabled', false)
          $('[data-create-project-name]').val('')
          $('[data-create-project-submit]').text('Add')
          $('[data-project-list]').append(res.data)
        }).catch(function(error) {
          console.log(error)
        })
      }))
    })
  }
}

