var propagit = require('propagit')
var async = require('async')
var inspect = require('eyespect').inspector();
module.exports = function stopPID(data, callback) {
  var killed = false
  var maxAttempts = 10
  var attempt = 0
  var stoppedIDs
  async.until(
    function () {
      return killed
    },
    function(cb) {
      performStop(data, function (err, stoppedIDsReply) {
        if (err) {
          return cb({
            message: 'error trying to stop spawned fleet process',
            error: err,
            stack: new Error().stack
          })
        }

        stoppedIDs = stoppedIDsReply
        inspect(stoppedIDs, 'stoppedIDs')
        inspect(attempt,'attempt #')
        if (stoppedIDs.length > 0) {
          killed = true
          return cb()
        }
        if (attempt >= maxAttempts) {
          return cb({
            message: 'error trying to stop spawned fleet process',
            error: 'max number of attempts reached when stopping process',
            stack: new Error().stack
          })
        }
        attempt += 1
        cb()
      })
    }, callback
  )
}

var performStop = function(data, cb) {
  var pid = data.pid
  inspect(pid, 'stopping pid')
  var p = propagit(data)
  p.on('error', function (err) {
    console.dir(err)
  })


  var drone = ''
  var drones = ''
  p.hub(function (hub) {
    var opts = {
      drone : drone,
      drones : drones,
      pid : pid
    }
    hub.stop(opts, function (err, drones) {
      if (err) {
        return cb({
          message: 'error stopping pid, bad response from hub',
          error: err,
          pid: pid,
          stack: new Error().stack
        })
      }
      var stopped = false
      var stoppedIDs = []
      Object.keys(drones).forEach(function (id) {
        var droneIDs = drones[id]
        if (droneIDs.length > 0) {
          stoppedIDs.push([id, pid])
        }
      })
      p.hub.close()
      cb(null, stoppedIDs)
    })
  })
}
