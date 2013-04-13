var rimraf = require('rimraf')
var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var cloneRepo = require('../lib/cloneRepo')

var repo = 'apples'
describe('Clone Repo', function () {
  it('should clone repo', function (done) {
    this.timeout(0)
    removeExistingRepo(function (err) {
      should.not.exist(err)
      var repoDir = path.join(__dirname,'setup/repos/apples.git')
      cloneRepo(repoDir, function(err, reply) {
        should.not.exist(err, 'error cloning repo: ' + JSON.stringify(err, null, ' '))
        inspect('repo cloned correctly')
        done()
      })
    })
  })
})

function removeExistingRepo(cb) {
  var dir = path.join(__dirname,'../repos/apples')
  inspect(dir,'dir')

  var exists = fs.existsSync(dir)
  if (!exists) {
    return cb()
  }
  rimraf(dir, cb)
}
