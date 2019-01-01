interface Context {
  response: import('@adonisjs/framework/src/Response')
  request: import('@adonisjs/framework/src/Request')
  view: import('@adonisjs/framework/src/View')
  auth: import('@adonisjs/auth/src/Schemes/Session')
  session: import('@adonisjs/session/src/Session')
}
