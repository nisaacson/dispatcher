require('./createDB')
var async = require('async');
var inspect = require('eyespect').inspector();

var couchProfile = require('../index');
var findProfile = couchProfile.findProfile;
var createUserProfile = require('../lib/createUserProfile');
var should = require('should');
var getDB = require('./getDB');
var path = require('path');
var fs = require('fs');
var assert = require('assert');
var configFilePath = path.join(__dirname, 'config.json');
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath);
var config = require('nconf').argv().env().file({ file: configFilePath });
describe('find profiles', function () {
  var db;
  var email = 'foo@example.com';
  before(function (done) {
    getDB(config, function (err, reply) {
      should.not.exist(err);
      should.exist(reply);
      db = reply;
      done();
    });
  });

  beforeEach(function (done) {
    var removeData = {
      db: db,
      email: email
    };
    removeIfNeeded(removeData, function (err) {
      should.not.exist(err);
      done();
    });
  });


  it('should not find non-existant profiles', function (done) {
    var data = {
      db: db,
      email: email
    };
    findProfile(data, function (err, reply) {
      should.not.exist(err);
      should.not.exist(reply);
      done();
    });
  });


  it('should find profiles that do exist', function (done) {
    var data = {
      db: db,
      email: email
    };
    createUserProfile(data, function (err, reply) {
      reply.should.have.property('_id');
      reply.should.have.property('_rev');
      var id = reply._id;
      db.get(id, function (err, reply) {
        should.not.exist(err);
        should.exist(reply, 'profile not created correctly');
        email.should.eql(reply.email);
        findProfile(data, function (err, findReply) {
          should.not.exist(err);
          should.exist(findReply, 'profile not found');
          done();
        });
      });
    });
  });
});


function removeIfNeeded(data, callback) {
  var db = data.db;
  var email = data.email;
  db.view('user_profile/byEmail', {key: email}, function (err, docs) {
    if (err) { return callback(err); }
    if (docs.length === 0) {
      return callback();
    };
    async.forEachSeries(
      docs,
      function (doc, cb) {
        var id = doc.value._id;
        var rev = doc.value._rev;
        db.remove(id, rev, cb);
      },
      callback);
  });
}
