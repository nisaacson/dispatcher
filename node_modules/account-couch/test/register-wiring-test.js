var assert = require('assert')
var should = require('should');
var inspect = require('eyespect').inspector();
var rewire = require('rewire')
describe('Register Wiring', function () {
  var data
  beforeEach(function () {
    data = {
      email: 'foo@example.com',
      password: 'barPassword',
      db: { foo: 'bar'}
    }
  })
  it('should give error if email is not unique', function (done) {
    var register = rewire('../lib/register')
    register.__set__('confirmEmailUnique', function (data, cb) {
      cb(null, false)
    })
    register(data, function (err, reply) {
      should.exist(err)
      err.message.should.eql('register failed, email is not unique')
      done()
    })
  })

  it('should be wired up correctly', function (done) {
    var register = rewire('../lib/register')
    var profile = {
      fizz: 'buzz'
    }
    register.__set__('confirmEmailUnique', function (data, cb) {
      cb(null, true)
    })
    register.__set__('couchProfile', {
      getOrCreateProfile: function (data, cb) {
        cb(null, profile)
      }
    })
    register(data, function (err, reply) {
      should.not.exist(err)
      reply.should.eql(profile)
      done()
    })
  })
})
