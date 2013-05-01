/**
 * The auth module implements the functions needed by the Passport module to
 * control access
 */
var inspect = require('eyespect').inspector({maxLength:10820})
var passport = require('passport')
var couchProfile = require('couch-profile')
var CouchStrategy = require('./CouchStrategy.js')
var config = require('nconf')
var db = require('cradle-nconf')(config)
module.exports = function (account) {
  var couchStrategy = CouchStrategy(account)
  inspect(couchStrategy, 'couchStrategy')
  passport.use('local', couchStrategy)
  passport.serializeUser(function(user, done) {
    inspect(user, 'serializeUser called')
    done(null, user.email)
  })
  passport.deserializeUser(function(email, done) {
    inspect(email, 'deserializeUser called')
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
