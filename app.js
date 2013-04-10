var passport = require('passport')
var http = require('http')
var express = require('express')
var config = require('nconf')
var connect = require('connect')
var RedisStore = require('connect-redis')(connect)
var redis = require('redis')
var ecstatic = require('ecstatic')
var routes = require('./routes')
module.exports = function(data, cb) {
  var port = config.get('portRange')[0]
  var app = express()
  var cookieSecret = config.get('application:cookieSecret')
  var sessionSecret = config.get('application:sessionSecret')
  var redisConfig = config.get('redis')
  var redisSessionClient = redis.createClient(redisConfig.port, redisConfig.host, {})
  authenticateRedis(redisSessionClient, function (err) {
    if (err) {
      return cb({
        message: 'failed to start dispatch server, error authenticating redis client',
        error: err,
        stack: new Error().stack
      })
    }
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
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

    app.use(ecstatic({
      root: __dirname + '/public',
      baseDir: '/static'
    }))
    app.use(app.router)
    routes(app)


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

function authenticateRedis(client, cb) {
  var redisConfig = config.get('redis')
  var password = redisConfig.password
  if (!password) {
    return cb()
  }
  client.auth(redisConfig.password, cb)
}
