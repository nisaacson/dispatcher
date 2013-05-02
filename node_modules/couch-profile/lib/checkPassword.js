var bcrypt = require('bcrypt-nodejs')
var rk = require('required-keys');
module.exports = function (data, cb) {
  var keys = ['profile', 'password']
  var err = rk.truthySync(data, keys)
  if (err) { return cb(err); }
  var profile = data.profile
  var hash = profile.hash
  var password = data.password
  bcrypt.compare(hash, password, cb)
}
