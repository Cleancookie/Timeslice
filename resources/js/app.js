'use strict'
// Polyfill
import '@babel/polyfill'

// Dependencies
window.$ = require('jquery')
import 'jquery-ui/ui/core'
import 'jquery-ui/ui/widgets/autocomplete'
import 'bootstrap'
import 'select2'

// Components
import LoginComponent from './components/login'
const login = new LoginComponent()

import DashboardComponent from './components/dashboard'
const dashboard = new DashboardComponent()
