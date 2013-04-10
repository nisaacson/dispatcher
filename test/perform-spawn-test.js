var async = require('async')
var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var db = require('cradle-nconf')(config)

var performSpawn = require('../lib/performSpawn')
describe('Perform Spawn ', function () {
  it('should spawn command', function (done) {
    db.view('spawn_command/all', {include_docs: true}, function (err, res) {
      should.not.exist(err,'error finding spawn command')
      res.length.should.be.above(0, 'no spawn command found')
      var spawnCommand = res[0].doc
      performSpawn(spawnCommand, function (err, reply) {
        should.not.exist(err, 'error performing spawn: ' + JSON.stringify(err, null, ' '))
        inspect(reply, 'perform spawn')
        done()
      })
    })
  })
})
