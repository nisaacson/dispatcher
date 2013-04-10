var login = require('./routes/login')
var register = require('./routes/register')
var hub = require('./lib/hub')
var ps = require('./lib/ps')
var stop = require('./lib/stop')
var repos = require('./lib/repos')
var addRepo = require('./lib/addRepo')
var deployRepo = require('./lib/deploy')
var commands = require('./lib/commands')
var addCommand = require('./lib/addCommand')
var spawn = require('./lib/spawn')
var ensureAuthenticated = require('./lib/ensureAuthenticated')
module.exports = function (app) {
  app.get('/ping', function (req, res) {
    res.send('pong')
  })

  app.get('/', function (req, res) {
    return res.redirect('/ps')
  })
  app.get('/login', login)
  app.post('/login', login)
  app.get('/register', register)
  app.post('/register', register)

  app.get('/hub', hub)
  app.get('/ps', ensureAuthenticated, ps)
  app.get('/ps/stop/:pid', ensureAuthenticated, stop)
  app.get('/repos', ensureAuthenticated, repos)
  app.get('/repos/add', ensureAuthenticated, addRepo)
  app.post('/repos/add', ensureAuthenticated, addRepo)

  app.post('/repos/deploy/:repo', ensureAuthenticated, deployRepo)

  app.get('/commands', ensureAuthenticated, commands)
  app.get('/commands/add', ensureAuthenticated, addCommand)
  app.post('/commands/add', ensureAuthenticated, addCommand)
  app.post('/spawn/:id', ensureAuthenticated, spawn)
}
