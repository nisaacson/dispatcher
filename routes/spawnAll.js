var inspect = require('eyespect').inspector();
var getPS = require('fleet-get-ps')
var config = require('nconf')
var db = require('cradle-nconf')(config)
var logger = require('loggly-console-logger')
var spawnAll = require('dispatch-spawn-all')
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

  var opts = {
    include_docs: true
  }
  db.view('spawn_command/all', opts, function (err, reply) {
    inspect(reply, 'spawn commands')
    var commands = reply.map(function (e) {
      e.host = host
      e.port = port
      e.secret = secret
      return e
    })
    inspect(commands,'commands')
    spawnAll(commands, function (err, reply) {
      if (err) {
        logger.error('error spawning all commands', {
          role: 'dispatch',
          section: 'spawnAll',
          error: err,
          commands: commands
        })
        delete err.stack
        req.session.error = 'Error spawning all commands: ' + JSON.stringify(err, null, ' ')
        return res.redirect('/commands')
      }
      req.session.success = 'All commands spawned correctly'
      return res.redirect('/ps')
    })
  })
}
