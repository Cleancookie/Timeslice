'use strict'
var PublicController = require('./PublicController');

class UserController extends PublicController{
  login({request, response, view}) {
    return view.render('User/login')
  }

  authenticateUser({request, auth}) {
    console.log(request);
    let { username, password } = request.all();
    auth.attempt(username, password);

    return 'Logged in successfully';
  }

  showProfile({auth, params}) {
    if (auth.user.id !== Number(params.id)) {
      return 'You cannot see someone else\'s profile'
    }
    return auth.user
  }
}

module.exports = UserController
