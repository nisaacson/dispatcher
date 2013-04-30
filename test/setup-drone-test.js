var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var startDrone = require('./setup/fleet/startDrone')
var getJSON = require('../lib/getJSON')
describe('Start Fleet Drone', function () {
  it('should start drone', function (done) {
    var data = {
      config: config
    }
    var fleetConfig = config.get('fleet')
    var host = fleetConfig.host
    var port = fleetConfig.port
    var secret = fleetConfig.secret
    var droneProcess = startDrone(config)
    droneProcess.stdout.setEncoding('utf8')
    droneProcess.stderr.setEncoding('utf8')
    droneProcess.stdout.on('data', function (data) {
      inspect(data, 'drone stdout data')
      data.should.eql('connected to the hub\n', 'incorrect drone data')
      done()
    })
    droneProcess.stderr.on('data', function (data) {
      inspect(data, 'drone stderr data')
      should.fail('drone should not write to stderr')
    })

    // getJSON(fleetConfig, function (err, reply) {
    //   inspect('got json')
    //   should.not.exist(err, 'error getting fleet ps json: ' + JSON.stringify(err, null, ' '))
    //   inspect(reply,'fleet json')
    // })
  })
})
