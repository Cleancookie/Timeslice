'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Project extends Model {
  users() {
    return this.belongsToMany('App/Models/User')
  }

  /**
   * Checks if a user ID has been assigned to a project
   * @param {number} id
   */
  async findAssignedUser(id) {
    let relatedUsers = await this.users().fetch();
    let found = false;

    relatedUsers.toJSON().forEach(user => {
      if (user.id == id) {
        found = true;
      }
    })

    return found;
  }
}

module.exports = Project
