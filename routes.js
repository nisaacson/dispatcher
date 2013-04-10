var passport = require('passport')
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
  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err)
      }
      if (!user) {
        // *** Display message using Express 3 locals
        var message = 'Login Failed'
        if (info && info.message) {
          message = info.message
        }
        req.session.message = message
        return res.redirect('/login')
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err)
        }
        req.session.password = req.body.password
        return res.redirect('/')
      })
    })(req, res, next)
  })

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
