/**
 * The auth module implements the functions needed by the Passport module to
 * control access
 */
var inspect = require('eyespect').inspector({maxLength: 'maxLength'});
var passport = require('passport')
var CouchStrategy = require('./CouchStrategy.js')
var config = require('nconf')
var db = require('cradle-nconf')(config)
module.exports = function (account) {
  var couchStrategy = CouchStrategy(account)
  passport.use('local', couchStrategy)
  passport.serializeUser(function(user, done) {
    account.serializeUser(user, done)
  })
  passport.deserializeUser(function(id, done) {
    account.deserializeUser(id, done)
  })
}
