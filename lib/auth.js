/**
 * The auth module implements the functions needed by the Passport module to
 * control access
 */
var inspect = require('eyespect').inspector({maxLength:10820})
var passport = require('passport')
var couchProfile = require('couch-profile')
var CouchStrategy = require('./CouchStrategy.js')

module.exports = function (data) {
  var config = data.config
  var db = data.db
  var couchStrategy = CouchStrategy(data)
  passport.use('local', couchStrategy)
  passport.serializeUser(function(user, done) {
    done(null, user.email)
  })
  passport.deserializeUser(function(email, done) {
    var profileData = {
      email: email,
      db: db
    }
    couchProfile.findProfile(profileData, function (err, profile) {
      if (err) { return done(err) }
      done(null, profile)
    })
  })
}
