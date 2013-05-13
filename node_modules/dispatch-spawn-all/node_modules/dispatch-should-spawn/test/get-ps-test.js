var inspect = require('eyespect').inspector();
var should = require('should');
var getPS = require('../')
var setupFleetHubAndDrone = require('./setupFleetHubAndDrone')
describe('get ps', function () {
  var data
  var hubProcess, droneProcess,
      secret,
      port
  before(function (done) {
    setupFleetHubAndDrone(function (err, reply) {
      should.not.exist(err)
      hubProcess = reply.hubProcess
      droneProcess = reply.droneProcess
      secret = reply.secret
      port = reply.port
      done()
    })
  })

  after(function () {
    hubProcess.kill()
    droneProcess.kill()
  })

  beforeEach(function () {
    data = {
      host: 'localhost',
      port: port,
      secret: secret
    }
  })

  it('should give error when host is not set', function (done) {
    delete data.host
    getPS(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('host')
      done()
    })
  })

  it('should give error when port is not set', function (done) {
    delete data.port
    getPS(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('port')
      done()
    })
  })

  it('should give error when secret is not set', function (done) {
    delete data.secret
    getPS(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('secret')
      done()
    })
  })

  it('should get ps data', function (done) {
    this.slow(300)
    getPS(data, function (err, reply) {
      should.not.exist(err)
      should.exist(reply)
      should.exist(reply.drone1)
      done()
    })
  })
})
