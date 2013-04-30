var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var startHub = require('./setup/fleet/startHub')
var getJSON = require('../lib/getJSON')
describe('Start Fleet Hub', function () {
  it('should start hub', function (done) {
    var data = {
      config: config
    }
    var fleetConfig = config.get('fleet')
    var host = fleetConfig.hub.host
    var port = fleetConfig.hub.port
    var secret = fleetConfig.hub.secret
    var hubProcess = startHub(data)
    var hub = [host, port].join(':')
    // get details about the hub
    var getJSONParams = {
      hub: hub,
      secret: secret
    }
    inspect('getting json')
    getJSON(getJSONParams, function (err, reply) {
      inspect('got json')
      should.not.exist(err, 'error getting fleet ps json: ' + JSON.stringify(err, null, ' '))
      inspect(reply,'fleet json')
    })
  })
})
