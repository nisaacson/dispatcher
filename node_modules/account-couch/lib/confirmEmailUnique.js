var couchProfile = require('couch-profile')
module.exports = function confirmUniqueEmail(data, cb) {
  var email = data.email
  var db = data.db
  var findData = {
    email: email,
    db: db
  }
  couchProfile.findProfile(findData, function (err, profile) {
    if (err) { return cb(err) }
    var unique = true
    if (profile) {
      unique = false
    }
    cb(null, unique)
  })
}
