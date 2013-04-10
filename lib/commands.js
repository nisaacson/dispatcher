var getJSON = require('./getJSON')
module.exports = function (req, res) {
  var commands = []
  res.render('commands', { title: 'Fleet Spawn Commands', commands: commands})
}


