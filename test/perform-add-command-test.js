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

var performAddCommand = require('../lib/performAddCommand')

var getSpawnCommandID = require('../lib/getSpawnCommandID')
describe('Peform Add Command', function () {

  var data
  beforeEach(function (done) {
    data = {
      repo: 'export-invoices',
      command: 'node exportInvoices.js --config /home/node/apps/docparse/server/production/config.json',
      drone: 'docparse001',
      instances: 1
    }
    removeAllCommands(done)
  })
  it('should reject data missing the "command" field', function (done) {
    delete data.command
    performAddCommand(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('command')
      done()
    })
  })
  it('should reject data missing the "instances" field', function (done) {
    delete data.instances
    performAddCommand(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('instances')
      done()
    })
  })

  it('should reject data missing the "repo" field', function (done) {
    delete data.repo
    performAddCommand(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('repo')
      done()
    })
  })

  it('should reject data missing the "drone" field', function (done) {
    delete data.drone
    performAddCommand(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('drone')
      done()
    })
  })
  it('should add command correctly', function (done) {
    this.timeout(0)
    performAddCommand(data, function(err, reply) {
      should.not.exist(err, 'error adding command: ' + JSON.stringify(err, null, ' '))
      done()
    })
  })

  it('should give error when adding duplicate command', function (done) {
    this.timeout(0)
    performAddCommand(data, function(err, reply) {
      should.not.exist(err, 'error adding command: ' + JSON.stringify(err, null, ' '))
      performAddCommand(data, function(err, reply) {
        should.exist(err, 'should give error when adding duplicate command')
        inspect(err,' error')
        err.error.should.eql('spawn command already exists')
        done()
      })
    })
  })
})


function removeAllCommands(cb) {
  db.view('spawn_command/all', {include_docs: true}, function (err, res) {
    should.not.exist(err,'error removing all docs')
    if (err) { return cb(err) }
    async.forEachSeries(
      res,
      function (element, cb) {
        var doc = element.doc
        var id = doc._id
        var rev = doc._rev
        db.remove(id, rev, cb)
      },
      cb
    )
  })
}
