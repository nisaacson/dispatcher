var assert = require('assert')
var path = require('path')
var inspect = require('eyespect').inspector();
var should = require('should');
var shouldSpawn = require('../')
describe('Running Should Spawn', function () {
  this.slow('2s')
  this.timeout('4s')
  var hubProcess, droneProcess,
      secret,
      port
  var command = 'node exportInvoices.js --config /home/node/apps/docparse/config.json'
  var repo = 'export-invoices'
  var spawnRecord = {
    command: command,
    repo: repo,
    instances: 1,
    host: 'localhost',
    port: '7000',
    secret: 'foo_secret'
  }
  it('spawn should be false when desired num instances are reached', function (done) {
    shouldSpawn(spawnRecord, function (err, reply) {
      should.not.exist(err)
      inspect(reply,'should spawn reply')
    })
  })
})
