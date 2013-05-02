var inspect = require('eyespect').inspector();
var passport = require('passport')
var http = require('http')
var express = require('express')
var connect = require('connect')
var RedisStore = require('connect-redis')(connect)
var redis = require('redis')
var ecstatic = require('ecstatic')
var routes = require('./routes/setup')
var auth = require('./lib/auth')
var rk = require('required-keys');
var AccountLogger = require('account-logger')
var AccountCouch = require('account-couch')
var logger = require('loggly-console-logger')
module.exports = function(data, cb) {
  var keys = ['config', 'db']
  var err = rk.truthySync(data, keys)
  if (err) {
    return cb({
      message: 'error starting dispatch app, missing key in data',
      error: err,
      stack: new Error().stack
    })
  }
  var config = data.config
  var port = config.get('portRange')[0]
  var db = data.db
  var app = express()
  var cookieSecret = config.get('application:cookieSecret')
  var sessionSecret = config.get('application:sessionSecret')
  var redisConfig = config.get('redis')
  var redisSessionClient = redis.createClient(redisConfig.port, redisConfig.host, {})
  authenticateRedis(redisSessionClient, redisConfig, function (err) {
    if (err) {
      return cb({
        message: 'failed to start dispatch server, error authenticating redis client',
        error: err,
        stack: new Error().stack
      })
    }
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
    app.use(express.favicon());
    app.use(express.cookieParser(cookieSecret))
    app.use(connect.session({
      store: new RedisStore({
        client: redisSessionClient,
        secret: sessionSecret
      })
    }))
    app.use(express.bodyParser())
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(function(req, res, next) {
      // Expose "error" and "message" to all views that are rendered.
      res.locals.error = req.session.error || ''
      res.locals.message = req.session.message || ''
      res.locals.success = req.session.success || ''
      // Remove them so they're not displayed on subsequent renders.
      delete req.session.error
      delete req.session.message
      delete req.session.success
      next()
    })

    app.use(function(req, res, next) {
      if (req.user && req.user.email) {
        res.locals.email = req.user.email
      }
      else {
        res.locals.email = undefined
      }
      next()
    })

    var accountCouch = new AccountCouch(db)
    var account = new AccountLogger(accountCouch, logger)
    app.use(app.router)
    app.use('/static', express.static(__dirname + '/public'));
    app.configure('development', function(){
      app.use(express.errorHandler());
      app.locals.pretty = true;
    })
    auth(account)
    function handleErrors(err, req, res, next) {
      inspect('handling error')
      inspect(err, 'error')
      logger.error('dispatch web error', {
        role: 'dispatch',
        error: err,
        statusCode: err.status,
        headers: req.headers,
        url: req.url
      })
      res.send('This is your custom error page.');
    }
    var routesData = {
      db: db,
      app: app,
      account: account,
      authWare: data.authWare
    }
    routes(routesData)


    var server = http.createServer(app)
    server.listen(port, function () {
      var output = {
        port: port,
        server: server
      }
      cb(null, output)
    })
  })
}

function authenticateRedis(client, redisConfig, cb) {
  var password = redisConfig.password
  if (!password) {
    return cb()
  }
  client.auth(redisConfig.password, cb)
}
