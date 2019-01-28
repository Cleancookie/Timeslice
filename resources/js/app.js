'use strict'
// Dependencies
window.$ = require('jquery')
import 'bootstrap'
window.axios = require('axios')

// Components
import DashboardComponent from './components/dashboard/index'

// Init
window.DashboardComponent = new DashboardComponent()
window.DashboardComponent.init()

