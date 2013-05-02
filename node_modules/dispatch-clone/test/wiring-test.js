var rimraf = require('rimraf')
var inspect = require('eyespect').inspector();
var should = require('should');
var path = require('path')
var fs = require('fs')
var assert = require('assert')
var cloneRepo = require('../')
describe('Clone Repo Wiring', function () {
  var data
  var containerDir = '/foo/container/path'
  var repoDir = path.join(__dirname, 'setup/repos/apples.git')
  beforeEach(function () {
    data = {
      containerDir: containerDir,
      url: repoDir
    }
  })
  it('should give error if containerDir is not writable', function (done) {
    assert.ok(!fs.existsSync(containerDir), 'containerDir should not exist on disk')
    cloneRepo(data, function (err) {
      should.exist(err)
      err.message.should.eql('failed to clone repo, error checking if containerDir is a writable directory')
      done()
    })
  })

  it('should clone repo', function (done) {
    containerDir = path.join(__dirname, 'dump')
    var outputDir = path.join(containerDir, 'apples')
    var exists = fs.existsSync(outputDir)
    if (exists) {
      rimraf.sync(outputDir)
    }
    data.containerDir = containerDir
    assert.ok(fs.existsSync(containerDir), 'containerDir should exist on disk')
    assert.ok(fs.existsSync(repoDir), 'repoDir should exist on disk')
    cloneRepo(data, function (err) {
      should.not.exist(err, 'error cloning repo: ' + JSON.stringify(err, null, ' '))
      assert.ok(fs.existsSync(outputDir), 'cloned repo should exist on disk at path: ' + outputDir)
      done()
    })
  })
})
