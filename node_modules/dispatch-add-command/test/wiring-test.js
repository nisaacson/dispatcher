var inspect = require('eyespect').inspector();
var should = require('should');
var addCommand = require('../')
describe('Wiring', function () {
  var data
  beforeEach(function () {
    data = {
      repo: 'apples',
      command: 'node applesServer',
      instances: 1,
      db: {}
    }
  })

  it('should give error when repo field is not set', function (done) {
    delete data.repo
    addCommand(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('repo')
      done()
    })
  })

  it('should give error when command field is not set', function (done) {
    delete data.command
    addCommand(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('command')
      done()
    })
  })

  it('should give error when instances field is not set', function (done) {
    delete data.instances
    addCommand(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('instances')
      done()
    })
  })

  it('should give error when db field is not set', function (done) {
    delete data.db
    addCommand(data, function (err, reply) {
      should.exist(err)
      err.error[0].key.should.eql('db')
      done()
    })
  })

  it('should be wired up correctly', function (done) {
    var rev = 'fooRev'
    var db = {
      get: function (id, cb) {
        cb()
      },
      save: function (id, doc, cb) {
        cb(null, {
          _rev: rev,
          _id: id,
          json: {
            foo: 'bar'
          }
        })
      }
    }
    data.db = db
    addCommand(data, function (err, reply) {
      should.not.exist(err, 'error adding command: ' + JSON.stringify(err, null, ' '))
      reply._rev.should.eql(rev)
      done()
    })
  })
})
