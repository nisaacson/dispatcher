var inspect = require('eyespect').inspector();
var rk = require('required-keys')
var confirmEmailUnique = require('./confirmEmailUnique')
var couchProfile = require('couch-profile')
module.exports = function (data, cb) {
  var keys = ['email', 'password']
  var db = this.db
  data.db = db
  var err = rk.truthySync(data, keys)
  if (err) {
    return cb({
      message: 'register failed, missing key in data',
      error: err,
      stack: new Error().stack
    })
  }
  confirmEmailUnique(data, function (err, unique) {
    if (err) { return cb(err) }
    if (!unique) {
      return cb({
        message: 'register failed, email is not unique',
        error: err,
        stack: new Error().stack
      })
    }
    var email = data.email
    var password = data.password
    var db = data.db
    var profileData = {
      email: email,
      password: password,
      db: db
    }
    couchProfile.getOrCreateProfile(profileData, cb)
  })
}

