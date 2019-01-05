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
      }.bind(this))

      $('[data-submit-new-project]').submit(function(event) {
        event.preventDefault();
      })
    })
  }
}

