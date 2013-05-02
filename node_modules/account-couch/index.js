var Account = require('account')
var register = require('./lib/register')
var login = require('./lib/login')
var removeUser = require('./lib/removeUser')
var serializeUser = require('./lib/serializeUser')
var deserializeUser = require('./lib/deserializeUser')
var AccountCouch = function(db) {
  this.db = db
}
AccountCouch.prototype = Object.create(Account)
AccountCouch.prototype.register = register
AccountCouch.prototype.login = login
AccountCouch.prototype.serializeUser = serializeUser
AccountCouch.prototype.deserializeUser = deserializeUser
AccountCouch.prototype.removeUser = removeUser

module.exports = AccountCouch
