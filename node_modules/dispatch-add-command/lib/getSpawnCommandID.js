var crypto = require('crypto')
module.exports = function (data) {
  var repo = data.repo
  var command = data.command
  var drone = data.drone
  var instances = data.instances
  var concate = repo + command + drone + instances
  var id = crypto.createHash('sha1').update(concate).digest('hex')
  return id
}
