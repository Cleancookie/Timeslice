'use strict'
import $ from 'jquery'
// import boostrap from 'bootstrap'
import DashboardComponent from './components/dashboard/index'

const dashboardComponent = new DashboardComponent()
dashboardComponent.init()

$(document).ready(function() {
  console.log('js loaded')
})
