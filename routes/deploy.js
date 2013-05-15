var performUpdateRepo = require('../lib/performUpdateRepo')
var deployRepo = require('../lib/performDeploy')
var logger = require('loggly-console-logger')
module.exports = function (req, res) {
  var repo = req.params.repo
  performUpdateRepo(repo, function (err, reply) {
    if (err) {
      req.session.error = 'Failed to deploy repo, error when updating repo from origin: ' + JSON.stringify(err, null, ' ')

      return res.redirect('/repos')
    }
    logger.info('deploy repo begin', {
      role: 'dispatch',
      section: 'deployRepo',
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
      }
      else {
        logger.info('deploy repo completed correctly', {
          role: 'dispatch',
          section: 'deployRepo',
          repo: repo
        })

        req.session.success = 'Deployed repo correctly. Response: ' + reply
      }
      res.redirect('/repos')
    })
  })
}
