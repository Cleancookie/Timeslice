"use strict"

const { LogicalException } = require("@adonisjs/generic-exceptions")

class UserNotAllowedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(err, { response }) {
    return response.status(403).json({
      error: "User is not allowed to perform this action"
    })
  }
}

module.exports = UserNotAllowedException
