'use strict'

/** @type {typeof import('app/Models/Base')} */
const Model = use('Model')

class Project extends Model {
  /**
   * Find all Users related to this Project
   *
   * @return {import('@adonisjs/lucid/src/Lucid/Relations/BelongsToMany')}
   */
  users() {
    return this.belongsToMany('App/Models/User')
  }

  /**
   * Find all Tasks related to this Project
   *
   * @return {import('@adonisjs/lucid/src/Lucid/Relations/HasMany')}
   */
  tasks() {
    return this.hasMany('App/Models/Task')
  }

  projects() {
    return this.belongsToMany('App/Models/Project')
  }

  /**
   * Checks if user has permission to edit the current project
   *
   * @param {import('./User')} user
   *
   * @return {boolean}
   */
  async canBeEditedBy(user) {
    let authenticatedUser = await this.users()
      .where('user_id', user.id)
      .first()
    if (!authenticatedUser) {
      return false
    }
    return true
  }

  /**
   * Checks if a user ID has been assigned to a project
   *
   * @param {number} id
   *
   * @return {boolean}
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
