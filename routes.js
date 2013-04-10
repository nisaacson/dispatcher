var hub = require('./lib/hub')
var ps = require('./lib/ps')
var stop = require('./lib/stop')
var repos = require('./lib/repos')
var addRepo = require('./lib/addRepo')
var deployRepo = require('./lib/deploy')
var commands = require('./lib/commands')
var addCommand = require('./lib/addCommand')
module.exports = function (app) {
  app.get('/ping', function (req, res) {
    res.send('pong')
  })

  app.get('/', function (req, res) {
    return res.redirect('/ps')
  })
  app.get('/hub', hub)
  app.get('/ps', ps)
  app.get('/ps/stop/:pid', stop)
  app.get('/repos', repos)
  app.get('/repos/add', addRepo)
  app.post('/repos/add', addRepo)

  app.post('/repos/deploy/:repo', deployRepo)

  app.get('/commands', commands)
  app.get('/commands/add', addCommand)
  app.post('/commands/add', addCommand)
}
