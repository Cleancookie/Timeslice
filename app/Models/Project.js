"use strict"

/** @type {typeof import('app/Models/Base')} */
const Model = use("Model")

class Project extends Model {
  users() {
    return this.belongsToMany("App/Models/User")
  }

  tasks() {
    return this.hasMany("App/Models/Task")
  }

  async canBeEditedBy(user) {
    let authenticatedUser = await this.users()
      .where("user_id", user.id)
      .first()
    if (!authenticatedUser) {
      return false
    }
    return true
  }

  /**
   * Checks if a user ID has been assigned to a project
   * @param {number} id
   */
  async findAssignedUser(id) {
    let relatedUsers = await this.users().fetch()
    let found = false

    relatedUsers.toJSON().forEach((user) => {
      if (user.id == id) {
        found = true
      }
    })

    return found
  }
}

module.exports = Project
