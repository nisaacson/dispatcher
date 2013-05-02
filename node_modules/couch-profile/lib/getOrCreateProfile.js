var rk = require('required-keys');
module.exports = function getProfile(data, cb) {
  var findUserProfile = data.findUserProfile || require('./findUserProfile');
  var createUserProfile = data.createUserProfile || require('./createUserProfile');
  var keys = ['db', 'email'];
  var err = rk.truthySync(data, keys);
  if (err) { return cb(err); }
  findUserProfile(data, function (err, reply) {
    if (err) {
      return cb(err);
    }
    if (reply) {
      return cb(null, reply);
    }
    createUserProfile(data, cb);
  });
};
