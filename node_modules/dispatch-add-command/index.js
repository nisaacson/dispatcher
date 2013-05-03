var inspect = require('eyespect').inspector();

var rk = require('required-keys');
var getSpawnCommandID = require('./lib/getSpawnCommandID')
module.exports = function (data, cb) {
  var keys = ['repo', 'command', 'instances', 'db']
  var err = rk.truthySync(data, keys)
  if (err) {
    return cb({
      message: 'failed to add command, missing key in data',
      error: err,
      stack: new Error().stack
    })
  }

  var repo = data.repo
  var command = data.command
  var instances = data.instances
  var db = data.db
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
      instances: instances,
      resource: 'SpawnCommand'
    }
    if (data.drone) {
      record.drone = data.drone
    }
    db.save(id, record, function (err, reply) {
      if (err) {
        return cb({
          message: 'failed to add spawn command, error when saving to the database',
          error: err,
          stack: new Error().stack
        })
      }
      record._id = id
      record._rev = reply._rev
      cb(null, record)
    })
  })
}
