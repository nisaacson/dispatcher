var bcrypt = require('bcrypt-nodejs')
var hashPassword = require('./hashPassword')
var rk = require('required-keys')
module.exports = function (data, cb) {
  var keys = ['db', 'email']
  var err = rk.truthySync(data, keys)
  if (err) { return cb(err) }
  var db = data.db
  var email = data.email
  var userProfile = {
    email: email,
    confirmed: false,
    roles: [],
    resource: 'Profile'
  }

  var password = data.password
  hashPasswordIfNeeded(data, function (err, hash) {
    if (err) { return cb(err) }
    if (hash) {
      userProfile.hash = hash
    }
    db.save(userProfile, function (err, reply) {
      if (err) { return cb(err) }
      userProfile._id = reply._id
      userProfile._rev = reply._rev
      cb(null, userProfile)
    })
  })
}


function hashPasswordIfNeeded(data, cb) {
  if (!data.password) { return cb() }
  hashPassword(data, cb)
}
