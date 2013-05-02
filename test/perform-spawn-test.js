var async = require('async')
var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var argv = require('optimist').demand('config').argv
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var db = require('cradle-nconf')(config)
var startHub = require('./setup/fleet/startHub')
var startDrone = require('./setup/fleet/startDrone')
var performSpawn = require('../lib/performSpawn')
describe('Perform Spawn ', function () {
  this.timeout('10s')
  this.slow('5s')
  var hubProcess, droneProcess
  before(function (done) {
    hubProcess = startHub({config: config})
    droneProcess = startDrone({config: config})
    droneProcess.stdout.on('data', function (data) {
      inspect(data, 'drone data')
      if (data.trim() === 'connected to the hub') {
        done()
      }
    })
  })

  after(function () {
    hubProcess.kill()
    droneProcess.kill()
  })

  it('should spawn command', function (done) {
    inspect('spawning command now')
    db.view('spawn_command/all', {include_docs: true}, function (err, res) {
      should.not.exist(err,'error finding spawn command')
      res.length.should.be.above(0, 'no spawn command found')
      var spawnCommand = res[0].doc
      performSpawn(spawnCommand, function (err, reply) {
        should.not.exist(err, 'error performing spawn: ' + JSON.stringify(err, null, ' '))
        inspect(reply, 'perform spawn')
        done()
      })
    })
  })
})
