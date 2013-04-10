var deployRepo = require('./deployRepo')
var updateRepo = require('./updateRepo')
module.exports = function (req, res) {
  var repo = req.params.repo
  updateRepo(repo, function (err, reply) {
    if (err) {
      req.session.error = 'Failed to deploy repo, error when updating repo from origin: ' + err
      return res.redirect('/repos')
    }
    deployRepo(repo, function (err, reply) {
      if (err) {
        delete err.stack
        req.session.error = 'Error deploying repo: ' + JSON.stringify(err, null, ' ')
      }
      else {
        req.session.success = 'Deployed repo correctly. Response: ' + reply
      }
      res.redirect('/repos')
    })
  })
}
