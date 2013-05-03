var async = require('async')
var stopPID = require('../lib/stopPID')
var config = require('nconf')
var logger = require('loggly-console-logger')
module.exports = function (req, res) {
  var pid = req.params.pid
  logger.info('stop pid route called', {
    role: 'dispatch',
    section: 'stop',
    pid: pid
  })
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
    host: host,
    port: port,
    secret: '*****',
    pid: pid
  })
  stopPID(data, function (err, reply) {
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
    req.session.success = 'correctly stopped pid: ' + pid
    logger.info('stop pid stopped correctly', {
      role: 'dispatch',
      section: 'stop',
      host: host,
      port: port,
      secret: '*****',
      pid: pid
    })
    return res.redirect('/ps')
  })
}
