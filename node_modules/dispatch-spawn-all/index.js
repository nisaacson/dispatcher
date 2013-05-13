var async = require('async')
var spawn = require('dispatch-spawn')
var shouldSpawn = require('dispatch-should-spawn')
module.exports = function (commands, callback) {
  async.forEach(
    commands,
    function (command, cb) {
      shouldSpawn(command, function (err, isSpawnNeeded) {
        if (err) { return cb(err) }
        if (!isSpawnNeeded) {
          return cb()
        }
        spawn(command, cb)
      })
    },
    callback
  )
}
