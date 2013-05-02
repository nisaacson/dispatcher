var assert = require('assert')
var should = require('should');
var inspect = require('eyespect').inspector();
var Account = require('account-couch')
var AccountLogger = require('..')
var db = {
  foo: 'bar'
}
describe('Register wiring test', function () {
  it('should log correct register attempts', function (done) {
    var account = new Account(db)
    var infoCount = 0
    var logger =  {
      info: function (msg, loggerData) {
        infoCount += 1
        should.exist(loggerData.data.password, 'password field missing from data')
        loggerData.data.password.should.eql('****')
      },
      error: function (msg, data) {
        inspect(msg, 'logger error message')
        inspect(data, 'logger error data')
        should.fail('logger.error should not be called')
      }
    }
    var profile = {
      email: 'foo@example.com'
    }
    account.register = function (data, cb) {
      cb(null, profile)
    }
    var accountLogger = new AccountLogger(account, logger)
    var data = {
      email: 'foo@example.com',
      password: 'bar'
    }
    accountLogger.register(data, function (err, reply) {
      should.not.exist(err)
      infoCount.should.eql(2)
      done()
    })
  })

  it('should log failed register attempts', function (done) {
    var account = new Account(db)
    var errorCount = 0
    var errorLogged = false
    var logger =  {
      error: function (msg, data) {
        errorCount += 1
        if (msg === 'register account failed to complete correctly') {
          errorLogged = true
          should.not.exist(data.reply)
        }
      },
      info: function (msg, data) {
      }
    }
    var desiredError = 'foo error'
    account.register = function (data, cb) {
      cb(desiredError)
    }
    var accountLogger = new AccountLogger(account, logger)
    var data = {
      foo: 'bar'
    }
    accountLogger.register(data, function (err, reply) {
      should.exist(err)
      assert.ok(errorLogged)
      err.should.eql(desiredError)
      done()
    })
  })
})
