var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var cloneRepo = require('../lib/cloneRepo')
describe('Clone Repo', function () {
  it('should clone repo', function (done) {
    this.timeout(0)
    var url = 'git@bitbucket.org:competitiveenergy/docparse-router.git'
    cloneRepo(url, function(err, reply) {
      should.not.exist(err, 'error cloning repo: ' + JSON.stringify(err, null, ' '))
      inspect('repo cloned correctly')
      done()
    })
  })
})
