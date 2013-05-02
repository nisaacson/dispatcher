require('./createDB')
var bcrypt = require('bcrypt-nodejs')
var async = require('async')
var createUserProfile = require('../lib/createUserProfile')
var should = require('should')
var getDB = require('./getDB')
var path = require('path')
var fs = require('fs')
var assert = require('assert')
var configFilePath = path.join(__dirname, 'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').argv().env().file({ file: configFilePath })
describe('create profile test', function () {
  var db
  var email = 'foo@example.com'
  before(function (done) {
    getDB(config, function (err, reply) {
      should.not.exist(err)
      should.exist(reply)
      db = reply
      var removeData = {
        db: db,
        email: email
      }
      removeIfNeeded(removeData, function (err) {
        should.not.exist(err)
        done()
      })
    })

  })
  it('should create profile with password', function (done) {
    this.slow('6s')
    this.timeout('12s')
    var password = 'fooPassword'
    var data = {
      db: db,
      email: email,
      password: password
    }
    createUserProfile(data, function (err, reply) {
      should.not.exist(err)
      reply.should.have.property('_id')
      reply.should.have.property('_rev')
      reply.should.have.property('hash')
      var id = reply._id
      db.get(id, function (err, reply) {
        should.not.exist(err)
        should.exist(reply)
        email.should.eql(reply.email)
        bcrypt.compare(password, reply.hash, function (err, reply) {
          should.not.exist(err)
          assert.ok(reply, 'bcrypt compare should be true')
          done()
        })
      })
    })
  })

  it('should create profile without password', function (done) {
    var password = 'fooPassword'
    var data = {
      db: db,
      email: email
    }
    createUserProfile(data, function (err, reply) {
      should.not.exist(err)
      reply.should.have.property('_id')
      reply.should.have.property('_rev')
      reply.should.not.have.property('hash')
      var id = reply._id
      db.get(id, function (err, reply) {
        should.not.exist(err)
        should.exist(reply)
        email.should.eql(reply.email)
        done()
      })
    })
  })
})


function removeIfNeeded(data, callback) {
  var db = data.db
  var email = data.email
  db.view('user_profile/byEmail', {key: email}, function (err, docs) {
    if (err) { return callback(err) }
    if (docs.length === 0) {
      return callback()
    }
    async.forEachSeries(
      docs,
      function (doc, cb) {
        var id = doc.value._id
        var rev = doc.value._rev
        db.remove(id, rev, cb)
      }, callback)
  })
}
