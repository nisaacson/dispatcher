var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var argv = require('optimist').demand('config').argv
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})

var portFinder = require('portfinder')
var deployRepo = require('../lib/deployRepo')
var startHub = require('./setup/fleet/startHub')
var startDrone = require('./setup/fleet/startDrone')
describe('Deploy Repo', function () {
  var hubProcess, droneProcess
  before(function (done) {
    portFinder.getPort(function (err, port) {
      should.not.exist(err, 'error getting random port: ' + JSON.stringify(err, null, ' '))
      var data = {
        host: 'localhost',
        port: port,
        secret: 'foo_secret'
      }
      config.set('fleet:port', data.port)
      config.set('fleet:secret', data.secret)
      hubProcess = startHub(data)
      droneProcess = startDrone(data)
      droneProcess.stdout.on('data', function (data) {
        inspect(data, 'drone data')
        if (data.trim() === 'connected to the hub') {
          done()
        }
      })
    })
  })

  after(function () {
    hubProcess.kill()
    droneProcess.kill()
  })
  it('should deploy repo', function (done) {
    this.timeout(0)
    var repo = 'apples'
    deployRepo(repo, function(err, reply) {
      should.not.exist(err, 'error cloning repo: ' + JSON.stringify(err, null, ' '))
      inspect(reply, 'deploy reply')
      done()
    })
  })
})
