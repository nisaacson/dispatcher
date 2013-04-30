var async = require('async')

var inspect = require('eyespect').inspector()
var path = require('path')
var assert = require('assert')
var fs = require('fs')
var argv = require('optimist').demand(['config']).argv
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({ file: configFilePath})
var app = require('../app')
var server
before(function (done) {
  this.timeout('50s')
  var logger = require('loggly-console-logger')
  var db = require('cradle-nconf')(config)
  var data = {
    config: config,
    logger: logger,
    db: db,
    role: 'web'
  }
  inspect('starting test server')
  app(data, function (err, reply) {
    inspect('test server started')
    if (err) { return done(err) }
    server = reply.server
    var output = {
      server: reply.server,
      port: reply.port,
      db: db
    }
    inspect('web server setup complete')
    done()
  })
})
after(function () {
  server.close()
})
