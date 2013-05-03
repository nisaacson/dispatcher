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
var startHub = require('./setup/fleet/startHub')
var startDrone = require('./setup/fleet/startDrone')

var getJSON = require('../lib/getJSON')
var setupFleetHubAndDrone = require('./setupFleetHubAndDrone')
describe('Get fleet-ps json', function () {
  var hubProcess, droneProcess
  before(function (done) {
    setupFleetHubAndDrone(config, function (err, reply) {
      should.not.exist(err)
      hubProcess = reply.hubProcess
      droneProcess = reply.droneProcess
      done()
    })
  })

  after(function () {
    hubProcess.kill()
    droneProcess.kill()
  })

  it('should get json', function (done) {
    var fleetConfig = config.get('fleet')
    var host = fleetConfig.host
    var port = fleetConfig.port
    var secret = fleetConfig.secret
    var data = {
      port: port,
      host: host,
      secret: secret
    }
    getJSON(data, function (err, reply) {
      should.not.exist(err, 'error getting fleet-ps output as json')
      should.exist(reply)
      done()
    })
  })
})
