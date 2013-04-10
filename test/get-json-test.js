var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var getJSON = require('../lib/getJSON')
describe('Get fleet-ps json', function () {
  it('should get json', function (done) {
    var fleetConfig = config.get('fleet')
    var host = fleetConfig.hub.host
    var port = fleetConfig.hub.port
    var secret = fleetConfig.hub.secret

    var hub = [host, port].join(':')
    var data = {
      hub: hub,
      secret: secret
    }
    getJSON(data, function (err, reply) {
      should.not.exist(err, 'error getting fleet-ps output as json')
      should.exist(reply)
      inspect(reply, 'fleet-ps json reply')
      done()
    })
  })
})
