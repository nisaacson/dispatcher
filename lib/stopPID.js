var propagit = require('propagit')
var async = require('async')
var inspect = require('eyespect').inspector();
var rk = require('required-keys');
module.exports = function stopPID(data, callback) {
  var keys = ['secret', 'pid', 'host','port']
  var err = rk.truthySync(data, keys)
  if (err) {
    return callback({
      message: 'failed to stop pid, missing key in data',
      error: err,
      stack: new Error().stack
    })
  }

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
          inspect('killed correctly')
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
    },
    function (err) {
      if (err) { return callback(err) }
      callback(null, stoppedIDs)
    }
  )
}

var performStop = function(data, cb) {
  var host = data.host
  var port = data.port
  var secret = data.secret
  var hub = [host, port].join(':')
  var propData = {
    hub: host + ':' + port,
    secret: secret
  }
  var pid = data.pip
  inspect(pid, 'stopping pid')
  var p = propagit(propData)
  p.on('error', function (err) {
    console.dir(err)
  })


  var drone = ''
  var drones = ''
  p.hub(function (hub) {
    var opts = {
      drone: drone,
      drones: drones,
      pid: pid
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

      inspect(drones,'drones')
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
