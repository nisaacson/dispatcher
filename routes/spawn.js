var path = require('path')
var inspect = require('eyespect').inspector();
var config = require('nconf')
var db = require('cradle-nconf')(config)
var performSpawn = require('dispatch-spawn')
var logger = require('loggly-console-logger')
module.exports = function (req, res) {
  var id = req.params.id
  logger.info('start spawning command', {
    role: 'dispatch',
    section: 'spawn',
    commandID: id
  })
  db.get(id,function (err, reply) {
    if (err) {
      logger.error('spawn command failed, failed to find command with given id', {
        role: 'dispatch',
        section: 'spawn',
        error: err,
        commandID: id
      })

      req.session.error = 'Spawn failed, command not found with id: ' + id + ', error: ' + err
      return res.redirect('/commands')
    }
    var spawnCommand = reply.json
    var fleetConfig = config.get('fleet')
    inspect(spawnCommand, 'spawnCommand')
    var repoDir = path.join(__dirname, '../repos/', spawnCommand.repo)
    var data = {
      host: fleetConfig.host,
      port: fleetConfig.port,
      secret: fleetConfig.secret,
      command: spawnCommand.command,
      repoDir: repoDir

    }
    performSpawn(data, function (err, reply) {
      if (err) {
        delete err.stack
        logger.error('spawn command failed', {
          role: 'dispatch',
          section: 'spawn',
          error: err,
          commandID: id,
          spawnCommand: spawnCommand
        })
        req.session.error = 'Error performing spawn: ' + JSON.stringify(err, null, ' ')
        return res.redirect('commands')
      }
      logger.info('spawn command completed correctly', {
        role: 'dispatch',
        section: 'spawn',
        error: err,
        commandID: id,
        spawnCommand: spawnCommand
      })

      req.session.success = 'Spawned command correctly. Response: ' + reply
      res.redirect('/commands')
    })
  })
}
