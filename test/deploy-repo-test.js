var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var deployRepo = require('../lib/deployRepo')
describe('Deploy Repo', function () {
  it('should deploy repo', function (done) {
    this.timeout(0)
    var repo = 'ngrid-electric-parser'
    deployRepo(repo, function(err, reply) {
      should.not.exist(err, 'error cloning repo: ' + JSON.stringify(err, null, ' '))
      inspect(reply, 'deploy reply')
      done()
    })
  })
})
