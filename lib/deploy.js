var deployRepo = require('./deployRepo')
module.exports = function (req, res) {
  var repo = req.params.repo
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

}


