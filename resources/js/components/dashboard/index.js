'use strict'
import $ from 'jquery'
import axios from 'axios'

import ProjectComponent from './ProjectComponent'

export default class DashboardComponent {
  constructor() {
    this.components = {}
    this.components.project = new ProjectComponent()
  }

  init() {
    this.components.project.init()

    $(document).ready(function() {
      // Hide details pane when clicking off it
      let mouseIsInside = false;
      $('[data-details]').hover(function(){
        mouseIsInside = true;
      }, function(){
        mouseIsInside = false;
      });

      $(document).click(function() {
        if(this != $("[data-details]")[0] && !mouseIsInside) {
            $("[data-details]").hide();
        }
      });
    })
  }
}
