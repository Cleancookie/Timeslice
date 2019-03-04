'use strict'
// Dependencies
const $ = require('jquery')
const _ = require('lodash')
const Cookie = require('./cookies')

class LoginComponent {
  constructor() {
    this.submitFormListener()
  }

  submitFormListener() {
    $('#login-form').submit((e) => {
      e.preventDefault()
      $('[data-login-submit]').prop('disabled', 'disabled')

      const username = $('#login-username').val()
      const password = $('#login-password').val()

      // Send api request
      let loginResponse = $.post('/api/v1/login', {
        username: username,
        password: password
      })

      loginResponse
        .then((data) => {
          console.log(data)
          window.theResponse = data
          $('[data-login-submit]').prop('disabled', false)
          window.location.href = '/dashboard'
        })
        .catch((data) => {
          $('[data-login-submit]').addClass('animated shake error')
          $('[data-login-submit]').on('animationend', function() {
            $('[data-login-submit]').removeClass('animated shake error')
          })
          $('[data-login-submit]').prop('disabled', false)
        })
    })
  }
}

module.exports = new LoginComponent()
