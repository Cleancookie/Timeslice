'use strict'
// Dependencies
const $ = require('jquery')
const _ = require('lodash')
import CookieComponent from './cookies'

export default new class LoginComponent {
  constructor() {
    if (!!$('#login-form').length) {
      console.log('Login form loaded')
      this.submitLoginFormListener()
    }

    if (!!$('#register-form').length) {
      console.log('Register form loaded')
      this.submitRegisterFormListener()
    }
  }

  submitLoginFormListener() {
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
          $('[data-login-submit]').prop('disabled', false)
          console.log(data)
          window.location.href = '/dashboard'
        })
        .catch((data) => {
          console.log(data)
          $('[data-login-submit]').addClass('animated shake error')
          $('[data-login-submit]').on('animationend', function() {
            $('[data-login-submit]').removeClass('animated shake error')
          })
          $('[data-login-submit]').prop('disabled', false)
        })
    })
  }

  submitRegisterFormListener() {
    $('#register-form').submit((e) => {
      e.preventDefault()
      const submitButton = $('[data-register-submit]')
      submitButton.prop('disabled', 'disabled')

      const username = $('#register-username').val()
      const password = $('#register-password').val()
      const confirmPassword = $('#register-confirm-password').val()

      // Send api request
      let registerResponse = $.post('/api/v1/register', {
        username: username,
        password: password,
        'confirm-password': confirmPassword
      })

      registerResponse
        .then((data) => {
          console.log(data)
          window.theResponse = data
          submitButton.prop('disabled', false)
          window.location.href = '/dashboard'
        })
        .catch((data) => {
          submitButton.addClass('animated shake error')
          submitButton.on('animationend', function() {
            submitButton.removeClass('animated shake error')
          })
          submitButton.prop('disabled', false)
        })
    })
  }
}()
