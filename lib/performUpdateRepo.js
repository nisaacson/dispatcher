var exec = require('child_process').exec
var inspect = require('eyespect').inspector();
var async = require('async')
var fs = require('fs')
var path = require('path')
var logger = require('loggly-console-logger')
module.exports = function getRepoNames(repo, cb) {
  logger.info('update repo begin', {
    role: 'dispatch',
    section: 'updateRepo',
    repo: repo
  })
  var repoDir = path.join(__dirname, '../repos/' + repo)
  fs.exists(repoDir, function (exists) {
    if (!exists) {
      logger.error('error updating local repo copy', {
        repoDir: repoDir,
        section: 'updateRepo',
        error: 'repo does not exist on disk',
        repo: repo
      })
      return cb({
        message: 'failed to update repo',
        error: 'repo not found on disk at path: ' + repoDir,
        stack: new Error().stack
      })
    }
    var cmd = '(cd ' + repoDir + ' && git pull origin master )'
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        logger.error('error updating local repo copy', {
          cmd: cmd,
          section: 'updateRepo',
          error: err,
          repo: repo
        })
        return cb({
          message: 'error updating local repo',
          command: cmd,
          error: err,
          stderr: stderr,
          stdout: stdout,
          stack: new Error().stack
        })
      }
      var output = stderr + stdout
      logger.info('repo updated correctly', {
        role: 'dispatch',
        section: 'updateRepo',
        repo: repo
      })
      cb(null, output)
    })
  })
}
