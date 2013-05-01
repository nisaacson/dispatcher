var passport = require('passport')
var inspect = require('eyespect').inspector()
var renderLoginPage = require('./renderLoginPage')
module.exports = function(req, res, next){
  inspect('login route called')
  if (req.user) {
    return res.redirect('/')
  }
  var method = req.method.toLowerCase()
  inspect(method, 'login route method')
  if (method !== 'post') {
    return renderLoginPage(req, res)
  }
  // inspect('posting to login page')
  // var authFunction = passport.authenticate('local', function(err, user, info) {
  //   if (err) {
  //     inspect(err, 'login error')
  //     req.session.error = 'Error performing login, please try again later'
  //     return res.redirect('/')
  //   }
  //   if (!user) {
  //     // *** Display message using Express 3 locals
  //     var message = 'Login Failed'
  //     inspect(message, 'login message')
  //     if (info && info.message) {
  //       message = info.message
  //     }
  //     req.session.message = message
  //     return
  //     return res.redirect('/login')
  //   }
  //   req.logIn(user, function(err) {
  //     if (err) {
  //       return next(err)
  //     }
  //     req.session.password = req.body.password
  //     return
  //     return res.redirect('/')
  //   })
  // })

  // inspect(authFunction.toString(), 'authFunction')
  // authFunction(req, res, next)
}
