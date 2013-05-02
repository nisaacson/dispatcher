var bcrypt = require('bcrypt-nodejs')
var couchProfile = require('couch-profile')
var rk = require('required-keys');
var inspect = require('eyespect').inspector();
module.exports = function (id, cb) {
  var db = this.db
  db.get(id, function (err, reply) {
    if (err) {
      return cb({
        message: 'failed to deserialize user',
        error: err,
        stack: new Error().stack
      })
    }
    var profile = reply.json
    delete profile.hash
    cb(null, profile)
  })
}
