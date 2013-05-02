require('./createDB')
var should = require('should');
var couchProfile = require('../index');
describe('Get Or create Profile', function () {
  var db = {};
  it('should be wired up correctly', function (done) {
    var email = 'foo@example.com';
    var userProfile = {
      email: email
    };
    var findUserProfileCallCount = 0;
    var findUserProfile = function(data, cb) {
      findUserProfileCallCount++;
      cb();
    };

    var createUserProfileCallCount = 0;
    var createUserProfile = function(data, cb) {
      createUserProfileCallCount++;
      cb(null, userProfile);
    };
    var data = {
      db: db,
      findUserProfile: findUserProfile,
      createUserProfile: createUserProfile,
      email: email
    };

    couchProfile.getOrCreateProfile(data, function (err, reply) {
      should.not.exist(err);
      findUserProfileCallCount.should.eql(1);
      createUserProfileCallCount.should.eql(1);
      userProfile.should.eql(reply);
      done();
    });
  });
});
