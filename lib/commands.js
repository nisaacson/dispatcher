var inspect = require('eyespect').inspector();
var config = require('nconf')
var db = require('cradle-nconf')(config)
module.exports = function (req, res) {
  db.view('spawn_command/all', {include_docs: true}, function (err, results) {
    var commands = results.map(function (element) {
      return element
    })
    res.render('commands', { title: 'Fleet Spawn Commands', commands: commands})
  })
}
