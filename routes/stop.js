var async = require('async')
var inspect = require('eyespect').inspector()
var stopPID = require('../lib/stopPID')
var config = require('nconf')
var logger = require('loggly-console-logger')
module.exports = function (req, res) {
  var pid = req.params.pid
  if (!pid) {
    req.session.error = 'no pid specified'
    return res.redirect('/ps')
  }
  var fleetConfig = config.get('fleet')
  var host = fleetConfig.host
  var port = fleetConfig.port
  var secret = fleetConfig.secret
  var data = {
    host: host,
    port: port,
    secret: secret,
    pid: pid
  }
  logger.info('stop pid begin', {
    role: 'dispatch',
    section: 'stop',
    pid: pid
  })
  stopPID(data, function (err, reply) {
    inspect(err, 'pid stopped with error')
    if (err) {
      logger.error('stop pid failed', {
        role: 'dispatch',
        section: 'stop',
        error: err,
        pid: pid
      })
      delete err.stack
      req.session.error = 'error stopping pid: ' + JSON.stringify(err, null, ' ')
      return res.redirect('/ps')
    }
    req.session.success = 'correctly stopped pid : ' + pid + ', ' + JSON.stringify(reply, null, ' ')
    logger.info('stop pid stopped correctly', {
      role: 'dispatch',
      section: 'stop',
      pid: pid
    })
    return res.redirect('/ps')
  })
}
