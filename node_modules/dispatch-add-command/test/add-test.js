var async = require('async')
var argv = require('optimist').demand('config').argv
var configFilePath = argv.config
var fs = require('fs')
var assert = require('assert')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var db = require('cradle-nconf')(config)
var should = require('should');
var addCommand = require('../')
describe('Add', function () {
  var data
  beforeEach(function (done) {
    data = {
      repo: 'apples',
      command: 'node applesServer',
      instances: 1,
      db: {}
    }
    removeExistingCommands(db, done)
  })
  it('should add command', function (done) {
    data.db = db
    addCommand(data, function (err, reply) {
      should.not.exist(err, 'error adding command: ' + JSON.stringify(err, null, ' '))
      var id = reply._id
      var rev = reply._rev
      should.exist(id, '_id field missing from reply')
      should.exist(rev, '_rev field missing from reply')
      reply.instances.should.eql(data.instances)
      done()
    })
  })
})


function removeExistingCommands(db, callback) {
  var opts = {
    include_docs: true
  }
  db.view('spawn_command/all', opts, function (err, res) {
    should.not.exist(err, 'error removing existing commands: ' + JSON.stringify(err, null, ' '))
    if (res.length === 0) {
      return callback()
    }
    async.forEachSeries(
      res,
      function (element, cb) {
        var doc = element.doc
        var id = doc._id
        var rev = doc._rev
        should.exist(id)
        should.exist(rev)
        db.remove(id, rev, cb)
      },
      callback
    )
  })
}
