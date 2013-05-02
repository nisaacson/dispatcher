var assert = require('assert')
var should = require('should');
var inspect = require('eyespect').inspector();
var Account = require('account-couch')
var AccountLogger = require('..')
var db = {
  foo: 'bar'
}
describe('Login wiring test', function () {
  it('should log correct login attempts', function (done) {
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
    account.login = function (data, cb) {
      cb(null, profile)
    }
    var accountLogger = new AccountLogger(account, logger)
    var data = {
      email: 'foo@example.com',
      password: 'bar'
    }
    accountLogger.login(data, function (err, reply) {
      should.not.exist(err)
      infoCount.should.eql(1)
      done()
    })
  })

  it('should log failed login attempts', function (done) {
    var account = new Account(db)
    var infoCount = 0
    var replyLogged = false
    var logger =  {
      info: function (msg, data) {
        infoCount += 1
        if (msg === 'login account failed to complete correctly') {
          replyLogged = true
          should.not.exist(data.reply)
        }
      },
      error: function (msg, data) {
        inspect(msg, 'logger error message')
        inspect(data, 'logger error data')
        should.fail('logger.error should not be called')
      }
    }
    var profile = null
    account.login = function (data, cb) {
      cb(null, profile)
    }
    var accountLogger = new AccountLogger(account, logger)
    var data = {
      foo: 'bar'
    }
    accountLogger.login(data, function (err, reply) {
      should.not.exist(err)
      assert.ok(replyLogged)
      done()
    })
  })
})
