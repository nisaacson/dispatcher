var async = require('async')
var inspect = require('eyespect').inspector()
var stopPID = require('./stopPID')
var config = require('nconf')
module.exports = function (req, res) {
  var pid = req.params.pid
  if (!pid) {
    req.session.error = 'no pid specified'
    return res.redirect('/ps')
  }
  var fleetConfig = config.get('fleet')
  var host = fleetConfig.hub.host
  var port = fleetConfig.hub.port
  var secret = fleetConfig.hub.secret
  var hub = [host, port].join(':')
  var data = {
    hub: hub,
    secret: secret,
    pid: pid
  }
  stopPID(data, function (err, reply) {
    inspect(err, 'pid stopped with error')
    if (err) {
      delete err.stack
      req.session.error = 'error stopping pid: ' + JSON.stringify(err, null, ' ')
      return res.redirect('/ps')
    }
    req.session.success = 'correctly stopped pid : ' + pid + ', ' + JSON.stringify(reply, null, ' ')
    return res.redirect('/ps')
  })
}
