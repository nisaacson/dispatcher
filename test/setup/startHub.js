/**
 * Start a fleet hub process in the ./hub/ directory
 */
var spawn = require('child_process').spawn
var path = require('path')
var should = require('should');
var inspect = require('eyespect').inspector();
var startHub = function startHub(data) {
  var hubDir = path.join(__dirname, 'hub')
  var secret = data.secret
  var host = data.host
  var port = data.port
  process.chdir(hubDir)
  var cmd = 'fleet-hub'
  var args = ['--port', port, '--secret', secret]
  // pipe all stdio to the parent process
  var opts = {}
  var child = spawn(cmd, args, opts)
  inspect(cmd,'fleet hub command')
  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.on('error', function (err) {
    inspect(err, 'fleet hub error')
    should.not.exist(err, 'error running fleet hub: ' + JSON.stringify(err, null, ' '))
  })
  child.stderr.on('data', function (data) {
    inspect('hub stderr')
    console.log(data)
  })
  return child
}

module.exports = startHub
