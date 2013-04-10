var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var performUpdateRepo = require('../lib/performUpdateRepo')
describe('Clone Repo', function () {
  this.timeout(0)
  this.slow('10s')
  it('should clone repo', function (done) {
    this.timeout(0)
    var repo = 'web'
    performUpdateRepo(repo, function(err, reply) {
      should.not.exist(err, 'error updating repo repo: ' + JSON.stringify(err, null, ' '))
      should.exist(reply)
      done()
    })
  })
})
