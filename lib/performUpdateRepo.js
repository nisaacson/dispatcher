var exec = require('child_process').exec
var inspect = require('eyespect').inspector();
var async = require('async')
var fs = require('fs')
var path = require('path')
module.exports = function getRepoNames(repo, cb) {
  var repoDir = path.join(__dirname, '../repos/' + repo)
  fs.exists(repoDir, function (exists) {
    if (!exists) {
      return cb({
        message: 'failed to update repo',
        error: 'repo not found on disk at path: ' + repoDir,
        stack: new Error().stack
      })
    }
    var cmd = '(cd ' + repoDir + ' && git pull origin master )'
     exec(cmd, function (err, stdout, stderr) {
      if (err) {
        return cb({
          message: 'error cloning repo',
          command: cmd,
          error: err,
          stderr: stderr,
          stdout: stdout,
          stack: new Error().stack
        })
      }
       var output = stderr + stdout
      cb(null, output)
    })
  })
}
