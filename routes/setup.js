var passport = require('passport')
var login = require('./login')

var hub = require('./hub')
var ps = require('./ps')
var stop = require('./stop')
var repos = require('./repos')
var addRepo = require('./addRepo')
var deploy = require('./deploy')
var commands = require('../lib/commands')
var addCommand = require('./addCommand')
var spawn = require('./spawn')
var spawnAll = require('./spawnAll')
var ensureAuthenticated = require('../lib/ensureAuthenticated')
var rk = require('required-keys');
var should = require('should');
module.exports = function (data) {
  var keys = ['app', 'db', 'account']
  var err = rk.truthySync(data, keys)
  should.not.exist(err, 'error setting up routes, missing key in data: ' + JSON.stringify(err, null, ' '))
  var authWare = data.authWare || ensureAuthenticated
  var app = data.app
  var db = data.db
  var account = data.account
  var register = require('./register')(account)
  app.get('/ping', function (req, res) {
    res.send('pong')
  })

  app.get('/', function (req, res) {
    return res.redirect('/repos')
  })
  app.get('/login', login)
  app.post('/login', login)
  app.get('/register', register)
  app.post('/register', register)
  app.get('/logout', function (req, res) {
    if (!req.user) {
      return res.redirect('/')
    }
    req.logOut()
    req.session.info = 'You have successfully logged out'
    res.redirect('/')
  })

  app.get('/hub', hub)
  app.get('/ps', authWare, ps)
  app.get('/ps/stop/:pid', authWare, stop)

  // repos
  app.get('/repos', authWare, repos)
  app.post('/repos', authWare, repos)
  app.get('/repos/add', authWare, addRepo)
  app.post('/repos/add', authWare, addRepo)
  app.post('/repos/deploy/:repo', authWare, deploy)

  // commands
  app.get('/commands', authWare, commands)
  app.post('/commands', authWare, commands)
  app.get('/commands/add', authWare, addCommand)
  app.post('/commands/add', authWare, addCommand)

  // spawn
  app.post('/spawn/:id', authWare, spawn)
  app.post('/spawnall', authWare, spawnAll)
  app.get('/spawnall', authWare, spawnAll)
}
