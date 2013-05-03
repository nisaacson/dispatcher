var exec = require('child_process').exec
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
  var maxAttempts = 100
  var attempt = 0
  var stoppedIDs
  async.until(
    function () {
      return killed
    },
    function(cb) {
      inspect(attempt,' attempt')
      performStop(data, function (err, stopped) {
        if (err) {
          return cb({
            message: 'error trying to stop spawned fleet process',
            error: err,
            stack: new Error().stack
          })
        }
        if (stopped) {
          inspect('stopped correctly')
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
  var pid = data.pid
  var pattern = new RegExp('stopped\\s*' + pid, 'i')
  var cmd = 'fleet-stop --hub=' + hub + ' --secret=' + secret + ' ' + pid
  exec(cmd, [], function (err, stdout, stderr) {
    if (err) {
      return cb({
        message: 'failed to stop pid',
        error: err,
        stack: new Error().stack
      })
    }
    if (stderr) {
      return cb({
        message: 'failed to stop pid',
        error: stderr,
        stack: new Error().stack
      })
    }
    var stopped = pattern.test(stdout)
    cb(null, stopped)
  })
}
