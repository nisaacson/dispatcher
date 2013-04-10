var config = require('nconf')
var db = require('cradle-nconf')(config)
var performUpdateRepo = require('./performUpdateRepo')
module.exports = function (req, res) {
  var repo = req.params.repo
  performUpdateRepo(repo, function (err, reply) {
    if (err) {
      delete err.stack
      req.session.error = 'Error updating repo: ' + JSON.stringify(err, null, ' ')
    }
    else {
      req.session.success = 'Repo updated correctly. Response: ' + reply
    }
    res.redirect('/repos')
  })
}
