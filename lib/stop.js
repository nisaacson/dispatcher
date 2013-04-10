var async = require('async')
var inspect = require('eyespect').inspector()
var getJSON = require('./getJSON')
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

}

