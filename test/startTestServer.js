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
module.exports = function (data, cb) {
  var logger = require('loggly-console-logger')
  var db = require('cradle-nconf')(config)
  inspect(data.authWare, 'authWare')
  var params = {
    config: config,
    logger: logger,
    db: db,
    authWare: data.authWare,
    role: 'dispatch'
  }
  inspect('starting test server')
  app(params, cb)
}
