var exec = require('child_process').exec
var inspect = require('eyespect').inspector();
var async = require('async')
var fs = require('fs')
var path = require('path')
module.exports = function getRepoNames(url, cb) {
  inspect(url,'cloning repo at url')
  var repoDir = path.join(__dirname, '../repos')
  var cmd = '(cd ' + repoDir + ' && git clone ' + url + ')'
  inspect(cmd,'clone command')
  exec(cmd, function (err, stdout, stderr) {
    inspect(err,'error')
    inspect(stdout, 'clone stdout')
    inspect(stderr, 'clone stderr')

    if (err) {
      return cb({
        message: 'error cloning repo',
        command: cmd,
        error: err,
        stack: new Error().stack
      })
    }
    if (stderr) {
      return cb({
        message: 'error cloning repo',
        command: cmd,
        error: stderr,
        stack: new Error().stack
      })
    }
    cb()
  })
}
