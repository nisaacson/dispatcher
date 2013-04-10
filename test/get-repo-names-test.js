var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var configFilePath = path.join(__dirname,'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var getRepoNames = require('../lib/getRepoNames')
describe('Get Repo Names', function () {
  it('should get repo names', function (done) {
    getRepoNames(function(err, reply) {
      should.not.exist(err, 'error getting repo names: ' + JSON.stringify(err, null, ' '))
      should.exist(reply)
      inspect(reply, 'get repo names reply')
      done()
    })
  })
})
