/**
 * Start a fleet hub process in the ./hub/ directory
 */
var spawn = require('child_process').spawn
var path = require('path')
var should = require('should');
var inspect = require('eyespect').inspector();
var startHub = function startHub(data) {
  var config = data.config
  var hubDir = path.join(__dirname, 'hub')
  var fleetConfig = config.get('fleet')
  should.exist(fleetConfig, 'fleet missing from config')
  var hubPort = fleetConfig.hub.port
  var secret = fleetConfig.hub.secret
  var cmd = '(cd ' + hubDir + ' && fleet hub --port=' + hubPort + ' --secret=' + secret + ')'
  inspect(cmd,' stat hub command')

  var args = []
  // pipe all stdio to the parent process
  var opts = {
    stdio: 'pipe'
  }

  var child = spawn(cmd, args, opts)
  child.on('error', function (err) {
    inspect(err, 'fleet hub error')
    should.not.exist(err, 'error running fleet hub: ' + JSON.stringify(err, null, ' '))
  })
  return child
}

module.exports = startHub
var config = require('nconf')
var data = {
  config: config
}
