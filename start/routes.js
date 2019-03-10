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

// Frontend
Route.get('/', 'PublicController.home').as('public.homepage')
Route.get('/login', 'PublicController.login').as('public.login')
Route.get('/logout', 'PublicController.logout').as('public.logout')
Route.get('/dashboard', 'PublicController.dashboard').as('public.dashboard')

Route.group(()=>{
  // Login API
  Route.post('login', 'UserController.login')
  Route.post('logout', 'UserController.logout')
  Route.get('logout', 'UserController.logout')
  Route.post('register', 'UserController.register')

  // Projects API
  Route.get('projects', 'ProjectController.index').middleware('auth')
  Route.get('projects/:id', 'ProjectController.show').middleware('auth')
  Route.post('projects', 'ProjectController.create').middleware('auth')
  Route.post('projects/:id', 'ProjectController.update').middleware('auth')
  Route.delete('projects/:id', 'ProjectController.delete').middleware('auth')

  // Tasks API
  Route.get('projects/:id/tasks', 'TaskController.index').middleware('auth')
  Route.get('tasks/:id', 'TaskController.show').middleware('auth')
  Route.post('projects/:id/tasks', 'TaskController.create').middleware('auth')
  Route.post('tasks/:id', 'TaskController.update').middleware('auth')
  Route.post('tasks/:id/delete', 'TaskController.delete').middleware('auth')

  // Stage API
  Route.get('projects/:id/stages', 'StageController.index').middleware('auth')

  // Task actions
  Route.post('tasks/:id/update-user', 'TaskController.updateUser')
  Route.post('tasks/:id/update-stage', 'TaskController.updateStage')
}).prefix('api/v1')
