var inspect = require('eyespect').inspector();
inspect('starting dispatch web server')
var should = require('should');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var optimist = require('optimist');
var nconf = require('nconf')
var argv = optimist.demand(['config']).argv;
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath);
var config = nconf.argv().env().file({file: configFilePath});
var logger = require('loggly-console-logger')
var db = require('cradle-nconf')(config)
var data = {
  config: config,
  db: db
}

var install = require('./spinup-install')
var rebuild = require('spinup-rebuild')
var serverPath = path.join(__dirname)
process.chdir(serverPath)
install(function (err, reply) {
  should.not.exist(err, 'error installing node modules: ' + JSON.stringify(err, null, ' '))
  rebuild(function (err, reply) {
    should.not.exist(err, 'error rebuilding node modules: ' + JSON.stringify(err, null, ' '))
    var appLib = require('./app')
    appLib(data, function (err, reply) {
      should.not.exist(err, 'error staring dispatch web service: ' + JSON.stringify(err, null, ' '))
      logger.debug('fleet dispatcher server online', {
        port: reply.port
      })
    })
  })
})
