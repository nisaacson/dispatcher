var bcrypt = require('bcrypt-nodejs')
var couchProfile = require('couch-profile')
var rk = require('required-keys');
module.exports = function (data, cb) {
  var keys = ['email', 'password']
  var err = rk.truthySync(data, keys)
  if (err) {
    return cb({
      message: ', missing key in data',
      error: err,
      stack: new Error().stack
    })
  }
  var email = data.email
  var db = this.db
  var password = data.password
  var findData = {
    email: email,
    db: db
  }
  couchProfile.findProfile(findData, function (err, profile) {
    if (err) { return cb(err) }
    if (!profile) {
      return cb()
    }
    var hash = profile.hash
    bcrypt.compare(password, hash ,function (err, reply) {
      if (err) { return cb(err) }
      if (!reply) {
        return cb()
      }
      cb(null, profile)
    })
  })
}
