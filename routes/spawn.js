var path = require('path')
var inspect = require('eyespect').inspector();
var config = require('nconf')
var db = require('cradle-nconf')(config)
var performUpdateRepo = require('../lib/performUpdateRepo')
var deployRepo = require('../lib/performDeploy')
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
    var repo = spawnCommand.repo
    var repoDir = path.join(__dirname, '../repos/', repo)
    var data = {
      host: fleetConfig.host,
      port: fleetConfig.port,
      secret: fleetConfig.secret,
      command: spawnCommand.command,
      drone: spawnCommand.drone,
      repoDir: repoDir

    }
    performUpdateRepo(repo, function (err, reply) {
      if (err) {
        req.session.error = 'Failed to deploy repo, error when updating repo from origin: ' + JSON.stringify(err, null, ' ')

        return res.redirect('/repos')
      }
      logger.info('deploy repo begin', {
        role: 'dispatch',
        section: 'spawn',
        repo: repo
      })
      deployRepo(repo, function (err, reply) {
        if (err) {
          logger.error('failed to deploy repo', {
            error: err,
            section: 'deployRepo'
          })
          delete err.stack
          req.session.error = 'Error deploying repo: ' + JSON.stringify(err, null, ' ')
          return res.redirect('/commands')
        }
        logger.info('deploy repo completed correctly', {
          role: 'dispatch',
          section: 'spawn',
          repo: repo
        })

        logger.info('spawn fleet process begin', {
          role: 'dispatch',
          section: 'spawn',
          repo: repo,
          command: spawnCommand.command
        })

        performSpawn(data, function (err, reply) {
          if (err) {
            logger.error('spawn command failed', {
              role: 'dispatch',
              section: 'spawn',
              error: err,
              commandID: id,
              spawnCommand: spawnCommand
            })
            delete err.stack
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
    })
  })
}
