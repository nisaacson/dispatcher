var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var argv = require('optimist').demand('config').argv
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})


var deployRepo = require('../lib/deployRepo')
var startHub = require('./setup/fleet/startHub')
var startDrone = require('./setup/fleet/startDrone')
describe('Deploy Repo', function () {
  before(function () {
    var hubProcess = startHub({config: config})
    var droneProcess = startDrone({config: config})
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
