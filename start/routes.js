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

Route.get('/login', 'UserController.login').as('user.login')
Route.get('/logout', 'UserController.logout').as('user.logout')
Route.post('/login', 'UserController.authenticateUser').as('user.authenticate')
Route.get('/dashboard', 'UserController.dashboard').as('user.dashboard').middleware('auth')
Route.post('/register', 'UserController.register').as('user.register')

Route.post('/projects/store', 'ProjectController.create').middleware('auth')
Route.get('/projects/:id', 'ProjectController.read')
Route.post('/projects/delete/:id', 'ProjectController.delete').middleware('auth')
Route.post('/projects/edit/:id', 'ProjectController.edit').middleware('auth')
