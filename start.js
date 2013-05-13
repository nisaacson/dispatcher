var should = require('should')
var inspect = require('eyespect').inspector()
inspect('starting dispatch web server')
var assert = require('assert')
var fs = require('fs')
var path = require('path')
var optimist = require('optimist')
var nconf = require('nconf')
var argv = optimist.demand(['config']).argv
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = nconf.argv().env().file({file: configFilePath})
var logger = require('loggly-console-logger')
var db = require('cradle-nconf')(config)
var data = {
  config: config,
  db: db
}

var appLib = require('./app')
appLib(data, function (err, reply) {
  should.not.exist(err, 'error staring dispatch web service: ' + JSON.stringify(err, null, ' '))
  logger.debug('fleet dispatcher server online', {
    port: reply.port
  })
})
