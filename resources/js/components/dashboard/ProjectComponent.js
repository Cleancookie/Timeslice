'use strict'
import $ from 'jquery'
import axios from 'axios'

export default class ProjectComponent {
  constructor() {

  }

  init() {
    $(document).ready(function() {
      // Show create new project dialogue
      $('[data-create-project]').on('click', function() {
        $('[data-create-project-form]').toggleClass('invisible')
      })

      // Hide create new project form when the user submits
      $('[data-create-project-form]').on('submit', (function(event) {
        $('[data-create-project-name]').attr('disabled', true)
        $('[data-create-project-submit]').text('Saving...')
        event.preventDefault();
        axios.post('/projects/store', {
          name: $('[data-create-project-name]').val()
        }).then(function(res) {
          $('[data-create-project-form]').addClass('invisible')
          $('[data-create-project-name]').attr('disabled', false)
          $('[data-create-project-name]').val('')
          $('[data-create-project-submit]').text('Add')
          $('[data-project-list]').append(res.data)
        }).catch(function(error) {
          console.log(error)
        })
      }))

      // Show project details when the user clicks on a project
      $('[data-project-item]').on('click', function() {
        let projectId = $(this).data('project-id')

        axios.get('/projects/' + projectId).then(function(res) {
          $('[data-details]').html(res.data)
          $("[data-details]").show();
        }).catch(function(error) {
          console.log(error)
        })
      })
    })
  }
}

