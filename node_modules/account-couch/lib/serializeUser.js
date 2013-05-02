var bcrypt = require('bcrypt-nodejs')
var couchProfile = require('couch-profile')
var rk = require('required-keys');
var inspect = require('eyespect').inspector();
module.exports = function (profile, cb) {
  var id = profile._id
  cb(null, id)
}
