var inspect = require('eyespect').inspector();
var should = require('should');
var assert = require('assert')
var fs = require('fs')
var performSpawn = require('../')
describe('Perform Spawn Wiring', function () {
  var data
  var repoDir = '/foo/path/';
  beforeEach(function () {
    data = {
      host: 'localhost',
      port: 4000,
      secret: 'foo_secret',
      command: 'node applesServer',
      repoDir: repoDir
    }
  })

  it('should give error when "host" field is missing', function (done) {
    delete data.host
    performSpawn(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('host')
      done()
    })
  })

  it('should give error when "port" field is missing', function (done) {
    delete data.port
    performSpawn(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('port')
      done()
    })
  })

  it('should give error when "secret" field is missing', function (done) {
    delete data.secret
    performSpawn(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('secret')
      done()
    })
  })

  it('should give error when "command" field is missing', function (done) {
    delete data.command
    performSpawn(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('command')
      done()
    })
  })

  it('should give error when "repoDir" field is missing', function (done) {
    delete data.repoDir
    performSpawn(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('repoDir')
      done()
    })
  })

  it('should give error when repo dir does not exist on disk', function (done) {
    assert.ok(!fs.existsSync(repoDir), 'dummy path should not exist')
    performSpawn(data, function (err, reply) {
      should.exist(err)
      err.message.should.eql('perform spawn failed, repo missing')
      done()
    })
  })
})
