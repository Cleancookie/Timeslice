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
const LoginComponent = require('./components/login')
const DashboardComponent = require('./components/dashboard')
