var LocalStrategy = require('passport-local').Strategy
var inspect = require('eyespect').inspector();
module.exports = function (account) {
  var params = {
    usernameField: 'email',
    passwordField: 'password'
  }
  var strategy = new LocalStrategy(params, function(email, password, done) {
    var findData = {
      email: email,
      password: password
    }
    account.login(findData, done)
  })
  return strategy
}
