var passport = require('passport')
var inspect = require('eyespect').inspector()
var renderLoginPage = require('./renderLoginPage')
module.exports = function(req, res, next){
  if (req.user) {
    return res.redirect('/')
  }
  var method = req.method.toLowerCase()
  if (method !== 'post') {
    return renderLoginPage(req, res)
  }
  var authFunction = passport.authenticate('local', function(err, user, info) {
    if (err) {
      inspect(err, 'login error')
      req.session.error = 'Error performing login, please try again later'
      return res.redirect('/')
    }
    if (!user) {
      // *** Display message using Express 3 locals
      var message = 'Login Failed'
      if (info && info.message) {
        message = info.message
      }
      req.session.message = message
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err)
      }
      req.session.password = req.body.password
      return res.redirect('/')
    })
  })
  authFunction(req, res, next)
}
