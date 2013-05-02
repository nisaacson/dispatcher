var should = require('should');
var AccountCouch = require('account-couch')
var AccountLogger = require('../')
var db = {
  foo: 'bar'
}
describe('Prototype test', function () {
  it('should have correct functions on prototype', function (done) {
    var logger = {
      info: function (msg, data) {
      },
      error: function (msg, data) {
      }
    }
    var db = { foo: 'bar' }
    var accountCouch = new AccountCouch(db)
    var profile = {
      email: 'foo@example.com'
    }
    accountCouch.deserializeUser = function (id, cb) {
      var self = this
      profile._id = id
      cb(null, profile)
    }

    var accountLogger = new AccountLogger(accountCouch, logger)
    var innerAccount =  accountLogger.innerAccount
    should.exist(accountLogger.login)
    should.exist(accountLogger.register)
    should.exist(accountLogger.removeUser)
    should.exist(accountLogger.serializeUser)
    should.exist(accountLogger.deserializeUser)

    var id = 'fooID'
    accountLogger.deserializeUser(id, function (err, reply) {
      should.not.exist(err, 'error in deserializeUser: ' + JSON.stringify(err, null, ' '))
      done()
    })
  })
})
