'use strict'
// Polyfill
import '@babel/polyfill'

// Dependencies
window.$ = require('jquery')
import 'bootstrap'

// Components
import LoginComponent from './components/login'
const login = new LoginComponent()

import DashboardComponent from './components/dashboard'
const dashboard = new DashboardComponent()
