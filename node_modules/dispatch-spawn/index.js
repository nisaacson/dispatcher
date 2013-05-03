var exec = require('child_process').exec
var inspect = require('eyespect').inspector();
var fs = require('fs')
var rk = require('required-keys');
module.exports = function performSpawn(data, cb) {
  var keys = ['host', 'port', 'secret', 'command', 'repoDir']
  var err = rk.truthySync(data, keys)
  if (err) {
    return cb({
      message: 'performSpawn failed, missing key in data',
      error: err,
      stack: new Error().stack
    })
  }
  var repoDir = data.repoDir
  var command = data.command
  var drone = data.drone
  var instances = data.instances
  var host = data.host
  var port = data.port
  var secret = data.secret
  var hub = [host, port].join(':')
  fs.exists(repoDir, function (exists) {
    if (!exists) {
      return cb({
        message: 'perform spawn failed, repo missing',
        error: 'repo not found on disk at path: ' + repoDir,
        command: command,
        stack: new Error().stack
      })
    }
    process.chdir(repoDir)
    var cmd = 'fleet-spawn'
    var args = [
      '--hub=' + hub,
      '--secret', secret,
      '-- ', command
    ]
    cmd = 'fleet-spawn --hub=' + hub + ' --secret=' + secret
    if (data.drone) {
      var droneArg = ' --drone=' + data.drone
      cmd += droneArg
    }

    cmd += ' -- ' + command
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        return cb({
          message: 'perform spawn failed',
          command: cmd,
          error: err,
          stack: new Error().stack
        })
      }
      if (stderr) {
        return cb({
          message: 'perform spawn failed',
          command: cmd,
          error: stderr,
          stack: new Error().stack
        })
      }
      cb(null, stdout)
    })
  })
}
