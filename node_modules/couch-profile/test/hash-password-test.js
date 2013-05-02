var assert = require('assert')
var bcrypt = require('bcrypt-nodejs')
var inspect = require('eyespect').inspector({maxLength: 200000})
var should = require('should')
var hashPassword = require('../lib/hashPassword')
describe('Hash password', function () {
  it('should hash password correctly with default num rounds', function (done) {
    this.timeout('20s')
    this.slow('10s')
    var password = 'fooBar'
    var data = {
      password: password
    }
    hashPassword(data, function (err, reply) {
      should.not.exist(err)
      should.exist(reply)
      bcrypt.compare(password, reply, function (err, reply) {
        should.not.exist(err)
        assert.ok(reply, 'compare should be true')
        done()
      })
    })
  })

  it('should hash password correctly with custom num rounds', function (done) {
    this.timeout('8s')
    this.slow('4s')
    var password = 'fooBar'
    var data = {
      password: password,
      rounds: 2
    }
    hashPassword(data, function (err, hash) {
      should.not.exist(err)
      should.exist(hash)
      bcrypt.compare(password, hash, function (err, reply) {
        should.not.exist(err)
        assert.ok(reply, 'compare should be true')
        var dummy = 'fooPassword'
        dummy.should.not.eql(password, 'password should not eql dummy')
        bcrypt.compare(dummy, hash, function (err, reply) {
          should.not.exist(err)
          assert.ok(!reply, 'compare should be false')
          done()
        })
      })
    })
  })
})
