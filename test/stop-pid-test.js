var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var stopPID = require('../lib/stopPID')
describe('Stop PID', function () {
  this.timeout(0)
  it('should stop pid', function (done) {
    var pid = 'd7b2e8'
    var fleetConfig = config.get('fleet')
    var host = fleetConfig.hub.host
    var port = fleetConfig.hub.port
    var secret = fleetConfig.hub.secret

    var hub = [host, port].join(':')
    var data = {
      hub: hub,
      secret: secret,
      pid: pid
    }
    stopPID(data, function(err, reply) {
      if (err) {
        console.log(err.stack)
        delete err.stack
        inspect(err, 'stop error')
      }
      should.not.exist(err, 'error stopped pid: ' + JSON.stringify(err, null, ' '))
      should.exist(reply)
      inspect(reply, 'stop pid reply')
      done()
    })
  })
})
