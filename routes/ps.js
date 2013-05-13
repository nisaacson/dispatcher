var inspect = require('eyespect').inspector();
var getPS = require('fleet-get-ps')
var logger = require('loggly-console-logger')
var config = require('nconf')
module.exports = function (req, res) {
  var fleetConfig = config.get('fleet')
  var host = fleetConfig.host
  var port = fleetConfig.port
  var secret = fleetConfig.secret
  var data = {
    port: port,
    host: host,
    secret: secret
  }
  getPS(data, function (err, reply) {
    if (err) {
      req.session.error = 'Error getting ps data from fleet'
      logger.error('error getting json ps data from fleet', {
        error: err,
        role: 'dispatch',
        section: 'ps'
      })
      return res.redirect('/')
    }
    var droneKeys = Object.keys(reply).sort(function (a, b) {
      return a.localeCompare(b)
    })
    var drones = droneKeys.map(function (key) {
      var pids = reply[key]
      var element = makePIDSAnArray(pids)
      var output = {
        drone: key,
        pids: element
      }
      return output
    })
    res.render('ps', { title: 'fleet ps', drones: drones})
  })
}

function makePIDSAnArray(pids) {
  var keys = Object.keys(pids)
  var output = keys.map(function (key) {
    var element = pids[key]
    element.command = element.command.join(' ')
    element.pid = key
    return element
  })
  return output
}
