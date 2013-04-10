var inspect = require('eyespect').inspector();
var config = require('nconf')
var db = require('cradle-nconf')(config)
module.exports = function (req, res) {
  db.view('spawn_command/all', {include_docs: true}, function (err, results) {
    if (err) {
      delete err.stack
      req.session.error = 'error getting list of commands from the database: ' + JSON.stringify(err, null, ' ')
      return res.redirect('/ps')
    }
    var commands = results.map(function (element) {
      return element
    })
    res.render('commands', { title: 'Fleet Spawn Commands', commands: commands})
  })
}
