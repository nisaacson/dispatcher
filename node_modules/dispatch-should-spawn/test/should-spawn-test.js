var assert = require('assert')
var path = require('path')
var inspect = require('eyespect').inspector();
var should = require('should');
var shouldSpawn = require('../')
var spawn = require('dispatch-spawn')
var setupFleetHubAndDrone = require('./setupFleetHubAndDrone')
describe('Should Spawn', function () {
  this.slow('2s')
  this.timeout('4s')
  var hubProcess, droneProcess,
      secret,
      port
  var command = 'node applesServer.js'
  var repo = 'apples'
  var repoDir = path.join(__dirname, 'setup/repos/apples')
  var spawnRecord
  before(function (done) {
    setupFleetHubAndDrone(function (err, reply) {
      should.not.exist(err)
      hubProcess = reply.hubProcess
      droneProcess = reply.droneProcess
      secret = reply.secret
      port = reply.port
      spawnRecord = {
        host: 'localhost',
        port: port,
        command: command,
        secret: secret,
        repo: repo,
        repoDir: repoDir,
        instances: 2
      }
      done()
    })
  })

  after(function () {
    hubProcess.kill()
    droneProcess.kill()
  })

  it('spawn should be true', function (done) {
    shouldSpawn(spawnRecord, function (err, reply) {
      should.not.exist(err)
      assert.ok(reply)
      done()
    })
  })

  it('spawn should be false when desired num instances are reached', function (done) {
    spawn(spawnRecord, function (err, reply) {
      should.not.exist(err, 'error spawning test command: ' + JSON.stringify(err, null, ' '))
      shouldSpawn(spawnRecord, function (err, reply) {
        should.not.exist(err)
        assert.ok(reply, 'reply should be true')
        spawn(spawnRecord, function (err, reply) {
          should.not.exist(err, 'error spawning test command: ' + JSON.stringify(err, null, ' '))
          shouldSpawn(spawnRecord, function (err, reply) {
            should.not.exist(err)
            assert.ok(reply, 'reply should be false')
            done()
          })
        })
      })
    })
  })
})
