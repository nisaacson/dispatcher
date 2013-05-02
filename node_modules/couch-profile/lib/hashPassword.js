var bcrypt = require('bcrypt-nodejs')
var rk = require('required-keys');
module.exports = function (data, cb) {
  var keys = ['password']
  var err = rk.truthySync(data, keys)
  if (err) { return cb(err); }
  var password = data.password
  var rounds = data.rounds || 12
  var progress = function () {
  }
  bcrypt.genSalt(rounds, function (err, salt) {
    if (err) { return cb(err); }
    bcrypt.hash(password, salt, progress, cb)
  });
}
