var bcrypt = require('bcrypt-nodejs')
var couchProfile = require('couch-profile')
var inspect = require('eyespect').inspector({maxLength:10820})
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
module.exports = function (data, cb) {
  var db = data.db
  var strategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    var findData = {
      email: email,
      db: db
    }
    couchProfile.findProfile(findData, function (err, profile) {
      if (err) { return done(err) }
      if (!profile) {
        return done()
      }
      var hash = profile.hash
      bcrypt.compare(password, hash ,function (err, reply) {
        if (err) { return done(err) }
        if (!reply) {
          return done()
        }
        done(null, profile)
      })
    })
  })
  return strategy
}
