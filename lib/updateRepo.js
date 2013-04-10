var config = require('nconf')
var db = require('cradle-nconf')(config)
var performUpdateRepo = require('./performUpdateRepo')
var logger = require('loggly-console-logger')
module.exports = function (req, res) {
  var repo = req.params.repo
  logger.info('updating repo', {
    role: 'dispatch',
    repo: repo
  })
  performUpdateRepo(repo, function (err, reply) {
    if (err) {
      logger.error('failed to update repo', {
        role: 'dispatch',
        repo: repo,
        error: err
      })
      delete err.stack
      req.session.error = 'Error updating repo: ' + JSON.stringify(err, null, ' ')
    }
    else {
      logger.info('updating repo correctly', {
        role: 'dispatch',
        repo: repo
      })

      req.session.success = 'Repo updated correctly. Response: ' + reply
    }
    res.redirect('/repos')
  })
}
