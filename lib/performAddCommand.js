var inspect = require('eyespect').inspector();

var rk = require('required-keys');
var config = require('nconf')
var getSpawnCommandID = require('./getSpawnCommandID')
var db = require('cradle-nconf')(config)
module.exports = function (data, cb) {
  var keys = ['repo', 'command', 'drone', 'instances']
  var err = rk.truthySync(data, keys)
  if (err) {
    return cb({
      message: ', missing key in data',
      error: err,
      stack: new Error().stack
    })
  }

  var repo = data.repo
  var command = data.command
  var drone = data.drone || ''
  var instances = data.instances
  var id = getSpawnCommandID(data)
  db.get(id, function (err, reply) {
    if (reply) {
      return cb({
        message: 'failed to add spawn command',
        error: 'spawn command already exists',
        stack: new Error().stack
      })
    }

    if (err && err.error !== 'not_found') {
      return cb({
        message: 'failed to add spawn command',
        error: err,
        stack: new Error().stack
      })
    }
    var record = {
      repo: repo,
      command: command,
      drone: drone,
      instances: instances,
      resource: 'SpawnCommand'
    }
    db.save(id, record, function (err, reply) {
      if (err) {
        return cb({
          message: 'failed to add spawn command, error when saving to the database',
          error: err,
          stack: new Error().stack
        })
      }
      cb()
    })
  })
}
