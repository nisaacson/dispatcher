var should = require('should');
var account = require('../')
describe('Account', function () {
  it('should have login function in exports', function () {
    should.exist(account.login)
    account.login.should.be.a('function')
  })
  it('should have register function in exports', function () {
    should.exist(account.register)
    account.register.should.be.a('function')
  })
  it('should have deserializeUser function in exports', function () {
    should.exist(account.deserializeUser)
    account.deserializeUser.should.be.a('function')
  })
  it('should have serializeUser function in exports', function () {
    should.exist(account.serializeUser)
    account.serializeUser.should.be.a('function')
  })
  it('should have remove function in exports', function () {
    should.exist(account.removeUser)
    account.removeUser.should.be.a('function')
  })


  it('should give error if interface login function is called', function (done) {
    account.login({}, function (err, reply) {
      should.exist(err)
      err.error.should.eql('not implemented')
      done()
    })
  })
  it('should give error if interface register function is called', function (done) {
    account.register({}, function (err, reply) {
      should.exist(err)
      err.error.should.eql('not implemented')
      done()
    })
  })
  it('should give error if interface deserializeUser is called', function (done) {
    account.deserializeUser({}, function (err, reply) {
      should.exist(err)
      err.error.should.eql('not implemented')
      done()
    })
  })
  it('should give error if interface serializeUser is called', function (done) {
    account.serializeUser({}, function (err, reply) {
      should.exist(err)
      err.error.should.eql('not implemented')
      done()
    })
  })

  it('should give error if interface remove is called', function (done) {
    account.removeUser({}, function (err, reply) {
      should.exist(err)
      err.error.should.eql('not implemented')
      done()
    })
  })
})
