'use strict'
import ProjectComponent from './ProjectComponent'

export default class DashboardComponent {
  constructor() {
    this.components = {}
    this.components.project = new ProjectComponent()
  }

  init() {
    this.components.project.init()
  }
}
