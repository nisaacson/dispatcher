/**
 * Start a fleet drone process in the ./drone/ directory
 */
var spawn = require('child_process').spawn
var path = require('path')
var should = require('should');
var inspect = require('eyespect').inspector();
var startDrone = function startDrone(config) {
  var droneDir = path.join(__dirname, 'drone')
  var fleetConfig = config.get('fleet')
  should.exist(fleetConfig, 'fleet missing from config')
  var secret = fleetConfig.secret
  var host = fleetConfig.host
  var port = fleetConfig.port
  var hub = [host, port].join(':')
  process.chdir(droneDir)
  var cmd = 'fleet-drone'
  var args = ['--hub', hub, '--secret', secret]
  inspect(cmd,' stat drone command')
  // pipe all stdio to the parent process
  var opts = {
    stdio: 'pipe'
  }

  var child = spawn(cmd, args, opts)
  child.on('error', function (err) {
    inspect(err, 'fleet drone error')
    should.not.exist(err, 'error running fleet drone: ' + JSON.stringify(err, null, ' '))
  })
  return child
}
module.exports = startDrone
