'use strict'
// Dependencies
const $ = require('jquery')
const _ = require('lodash')

export default class CreateProjectComponent {
  constructor() {
    this.newProjectListener()
  }

  newProjectListener() {
    $('[data-create-project-users]').select2({ width: '100%' })
  }
}
