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

Route.post('api/login', 'UserController.login').as('user.login')
Route.post('api/logout', 'UserController.logout').as('user.logout')
Route.post('api/register', 'UserController.register').as('user.register')

Route.get('api/projects', 'ProjectController.index').as('project.index').middleware('auth')
Route.get('api/projects/:id', 'ProjectController.read').middleware('auth')
Route.post('api/projects/create', 'ProjectController.create').as('project.create').middleware('auth')
Route.post('api/projects/update/:id', 'ProjectController.update').middleware('auth')
Route.post('api/projects/delete/:id', 'ProjectController.delete').middleware('auth')
