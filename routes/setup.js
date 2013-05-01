var passport = require('passport')
var inspect = require('eyespect').inspector();
var login = require('./login')

var hub = require('./hub')
var ps = require('./ps')
var stop = require('../lib/stop')
var repos = require('../lib/repos')
var addRepo = require('../lib/addRepo')
var deployRepo = require('../lib/deploy')
var commands = require('../lib/commands')
var addCommand = require('../lib/addCommand')
var spawn = require('../lib/spawn')
var ensureAuthenticated = require('../lib/ensureAuthenticated')
var rk = require('required-keys');
var should = require('should');
module.exports = function (data) {
  var keys = ['app', 'db', 'account']
  var err = rk.truthySync(data, keys)
  should.not.exist(err, 'error setting up routes, missing key in data: ' + JSON.stringify(err, null, ' '))
  var app = data.app
  var db = data.db
  var account = data.account
  var register = require('./register')(account)
  app.get('/ping', function (req, res) {
    res.send('pong')
  })

  app.get('/', function (req, res) {
    inspect('loading root url /')
    return res.redirect('/ps')
  })
  app.get('/login', login)
  app.post('/login', login)
  app.get('/register', register)
  app.post('/register', register)
  // app.post('/login', function(req, res, next) {
  //   if (!req.body || ! req.body.email) {
  //     return res.redirect('/')
  //   }
  //   inspect('start local auth')
  //   passport.authenticate('local', function(err, user, info) {
  //     if (err) {
  //       return next(err)
  //     }
  //     if (!user) {
  //       // *** Display message using Express 3 locals
  //       var message = 'Login Failed'
  //       inspect(message, 'login failed')
  //       if (info && info.message) {
  //         message = info.message
  //       }
  //       req.session.message = message
  //       return res.redirect('/login')
  //     }
  //     req.logIn(user, function(err) {
  //       if (err) {
  //         return next(err)
  //       }
  //       req.session.password = req.body.password
  //       return res.redirect('/')
  //     })
  //   })(req, res, next)
  // })
  app.get('/logout', function (req, res) {
    if (!req.user) {
      return res.redirect('/')
    }
    req.logOut()
    req.session.info = 'You have successfully logged out'
    res.redirect('/')
  })

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
