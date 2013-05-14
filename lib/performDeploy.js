var exec = require('child_process').exec
var inspect = require('eyespect').inspector();
var async = require('async')
var fs = require('fs')
var path = require('path')
var config = require('nconf')

module.exports = function deployRepo(repo, cb) {
  var repoDir = path.join(__dirname, '../repos/', repo)
  var fleetConfig = config.get('fleet')
  var host = fleetConfig.host
  var port = fleetConfig.port
  var secret = fleetConfig.secret
  var hub = [host, port].join(':')
  fs.exists(repoDir, function (exists) {
    if (!exists) {
      return cb({
        message: 'failed to deploy repo',
        error: 'repo not found on disk at path: ' + repoDir,
        stack: new Error().stack
      })
    }
    var cmd = '(cd ' + repoDir + ' && fleet-deploy --hub=' + hub + ' --secret=' + secret + ')'
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        return cb({
          message: 'error cloning repo',
          command: cmd,
          error: err,
          stack: new Error().stack
        })
      }
      var output = stdout + stderr
      cb(null, output)
    })
  })
}
