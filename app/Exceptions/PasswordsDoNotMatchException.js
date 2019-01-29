"use strict"

const { LogicalException } = require("@adonisjs/generic-exceptions")

class PasswordsDoNotMatchException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(err, { response }) {
    return response.status(403).json({
      errors: [
        {
          field: "confirm-password",
          message: "Passwords do not match"
        }
      ]
    })
  }
}

module.exports = PasswordsDoNotMatchException
