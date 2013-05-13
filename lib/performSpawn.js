var logger = require('loggly-console-logger')
var exec = require('child_process').exec
var inspect = require('eyespect').inspector();
var async = require('async')
var fs = require('fs')
var path = require('path')
var config = require('nconf')
var getPS = require('fleet-get-ps')
module.exports = function performSpawn(data, cb) {
  inspect('performSpawn called')
  var repo = data.repo
  var command = data.command
  var drone = data.drone
  var instances = data.instances
  var repoDir = path.join(__dirname, '../repos/', repo)
  var fleetConfig = config.get('fleet')
  var host = fleetConfig.host
  var port = fleetConfig.port
  var secret = fleetConfig.secret
  var hub = [host, port].join(':')
  fs.exists(repoDir, function (exists) {
    if (!exists) {
      return cb({
        message: 'failed to perform spawn',
        error: 'repo not found on disk at path: ' + repoDir,
        command: command,
        stack: new Error().stack
      })
    }
    logger.info('perform spawn start, checking if process should be spawned', {
      repo: repo,
      command: command,
      drone: drone,
      repoDir: repoDir,
      instances: instances
    })
    shouldSpawn(data, function (err, spawn) {
      if (err) { return cb(err) }
      if (!spawn) {
        return cb({
          message: 'failed to spawn command',
          error: 'command is already running the given number of instances',
          stack: new Error().stack
        })
      }
      var cmd = '(cd ' + repoDir + ' && fleet-spawn --hub=' + hub + ' --secret=' + secret + ' --drone=' + drone + ' -- ' + command + ')'
      exec(cmd, function (err, stdout, stderr) {
        if (err) {
          logger.error('perform spawn failed', {
            section: 'performSpawn',
            error: err,
            repo: repo,
            command: cmd,
            drone: drone,
            repoDir: repoDir,
            instances: instances
          })
          return cb({
            message: 'perform spawn failed',
            command: cmd,
            error: err,
            stack: new Error().stack
          })
        }
        if (stderr) {
          logger.error('perform spawn failed', {
            section: 'performSpawn',
            error: err,
            repo: repo,
            command: cmd,
            drone: drone,
            repoDir: repoDir,
            instances: instances
          })
          return cb({
            message: 'perform spawn failed',
            command: cmd,
            error: stderr,
            stack: new Error().stack
          })
        }
        logger.info('perform spawn completed correctly', {
          section: 'performSpawn',
          repo: repo,
          command: cmd,
          drone: drone,
          repoDir: repoDir,
          instances: instances,
          stdout: stdout
        })
        cb(null, stdout)
      })
    })
  })
}


/**
 * Check if the given command is already running on the given drone.
 * If it is running, then check if the alloted number of instances are satisfied
 */
function shouldSpawn(data, cb) {
  var command = data.command
  var instances = data.instances
  var drone = data.drone
  var fleetConfig = config.get('fleet')
  var host = fleetConfig.host
  var port = fleetConfig.port
  var secret = fleetConfig.secret
  var hub = [host, port].join(':')
  var jsonData = {
    port: port,
    host: host,
    secret: secret
  }
  getPS(jsonData, function (err, json) {
    if (err) { return cb(err) }
    var elements = json[drone]
    if (!elements || elements.length === 0) {
      return cb(null, true)
    }
    var matches = Object.keys(elements).filter(function (key) {
      var element = elements[key]
      var elementCommand = element.command.join(' ')
      if (element.repo !== data.repo) {
        return false
      }
      if (elementCommand !== command) {
        return false
      }
      return true
    })
    if (!matches || matches.length < instances) {
      return cb(null, true)
    }
    return cb(null, false)
    return cb(null, !matches)
  })
}
