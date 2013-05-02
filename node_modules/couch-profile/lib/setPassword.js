var bcrypt = require('bcrypt-nodejs')
var rk = require('required-keys');
module.exports = function (data, cb) {
  var keys = ['profile', 'password']
  var err = rk.truthySync(data, keys)
  if (err) { return cb(err); }
  var profile = data.profile
  var password = data.password

  var rounds = data.rounds || 12
  var progress = function (data) {
    console.log('hashing progress', data)
  }
  bcrypt.genSalt(rounds, function (err, salt) {
    if (err) { return cb(err); }
    bcrypt.hash(password, salt, progress, function (err, hash) {
      if (err) { return cb(err); }
      profile.password = hash;
    })
  });
}
