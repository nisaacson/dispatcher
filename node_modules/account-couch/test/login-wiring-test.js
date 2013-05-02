var assert = require('assert')
var should = require('should');
var inspect = require('eyespect').inspector();
var rewire = require('rewire')
describe('Login Wiring', function () {
  var data
  beforeEach(function () {
    data = {
      email: 'foo@example.com',
      password: 'barPassword',
      db: { foo: 'bar'}
    }
  })
  it('should return null if profile does not exist', function (done) {
    var login = rewire('../lib/login')
    login.__set__('couchProfile', {
      findProfile: function (findData, cb) {
        cb()
      }
    })
    login(data, function (err, reply) {
      should.not.exist(err)
      should.not.exist(reply)
      done()
    })
  })

  it('should return profile if password matches', function (done) {
    var login = rewire('../lib/login')
    var profile = {
      fizz: 'buzz',
      hash: 'fakeHash'
    }
    login.__set__('couchProfile', {
      findProfile: function (findData, cb) {
        cb(null, profile)
      }
    })
    login.__set__('bcrypt', {
      compare: function (password, hash, cb) {
        var match = true
        cb(null, match)
      }
    })
    login(data, function (err, reply) {
      should.not.exist(err)
      should.exist(reply)
      done()
    })
  })

  it('should return undefined if password does not match', function (done) {
    var login = rewire('../lib/login')
    var profile = {
      fizz: 'buzz',
      hash: 'fakeHash'
    }
    login.__set__('couchProfile', {
      findProfile: function (findData, cb) {
        cb(null, profile)
      }
    })
    login.__set__('bcrypt', {
      compare: function (password, hash, cb) {
        var match = false
        cb(null, match)
      }
    })
    login(data, function (err, reply) {
      should.not.exist(err)
      should.not.exist(reply)
      done()
    })
  })
})
