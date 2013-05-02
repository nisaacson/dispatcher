var exec = require('child_process').exec
var inspect = require('eyespect').inspector();
var async = require('async')
var fs = require('fs')
var path = require('path')
var config = require('nconf')
var logger = require('loggly-console-logger')
module.exports = function deployRepo(repo, cb) {
  var repoDir = path.join(__dirname, '../repos/', repo)
  var fleetConfig = config.get('fleet')
  var host = fleetConfig.host
  var port = fleetConfig.port
  var secret = fleetConfig.secret
  var hub = [host, port].join(':')
  fs.exists(repoDir, function (exists) {
    if (!exists) {
      logger.error('failed to deploy repo', {
        error: 'repo not found on disk',
        repoDir: repoDir,
        section: 'deployRepo'
      })
      return cb({
        message: 'failed to deploy repo',
        error: 'repo not found on disk at path: ' + repoDir,
        stack: new Error().stack
      })
    }
    var cmd = '(cd ' + repoDir + ' && fleet-deploy --hub=' + hub + ' --secret=' + secret + ')'
    logger.info('deploying repo', {
      role: 'dispatch',
      command: cmd,
      section: 'deployRepo',
      repo: repo
    })

    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        logger.error('failed to deploy repo', {
          role: 'dispatch',
          repo: repo,
          section: 'deployRepo',
          command: cmd,
          error: err
        })

        return cb({
          message: 'error cloning repo',
          command: cmd,
          error: err,
          stack: new Error().stack
        })
      }
      logger.info('deploying repo correctly', {
        role: 'dispatch',
        repo: repo,
        section: 'deployRepo',
        command: cmd,
        stdout: stdout,
        stderr: stderr
      })
      var output = stdout + stderr
      cb(null, output)
    })
  })
}
