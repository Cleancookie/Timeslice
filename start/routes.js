'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'PublicController.home')

Route.group(()=>{
  Route.post('login', 'UserController.login').as('user.login')
  Route.post('logout', 'UserController.logout').as('user.logout')
  Route.post('register', 'UserController.register').as('user.register')

  Route.get('projects', 'ProjectController.index').as('project.index').middleware('auth')
  Route.get('projects/:id', 'ProjectController.show').middleware('auth')
  Route.post('projects', 'ProjectController.create').as('project.create').middleware('auth')
  Route.post('projects/:id', 'ProjectController.update').middleware('auth')
  Route.delete('projects/:id', 'ProjectController.delete').middleware('auth')

  Route.get('projects/:id/tasks', 'TaskController.index').middleware('auth')
  Route.get('projects/:id/tasks/id', 'TaskController.show').middleware('auth')
  Route.post('projects/:id/tasks', 'TaskController.create').middleware('auth')
  Route.post('tasks/:id', 'TaskController.update').middleware('auth')
  Route.post('tasks/:id/delete', 'TaskController.delete').middleware('auth')
}).prefix('api/v1')
