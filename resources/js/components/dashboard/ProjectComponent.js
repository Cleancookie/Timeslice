'use strict'
import $ from 'jquery'
import axios from 'axios'

export default class ProjectComponent {
  constructor() {

  }

  init() {
    $(document).ready(function() {
      $('[data-create-project]').on('click', function() {
        axios.get('/projects/create').then(function(res) {
          $('[data-project-list]').append(res.data)
        }).catch(function(error) {
          console.log(error)
        })
      })

      $('[data-create-project-form]').on('submit', (function(event) {
        event.preventDefault();
        axios.post('/projects/store', {
          name: $('[data-new-project-name]').val()
        }).then(function(res) {
          $('[data-create-project-form]').parent('li').remove()
          $('[data-project-list]').append(res.data)
        }).catch(function(error) {
          console.log(error)
        })
      }))
    })
  }
}

