var cradle = require('cradle')
module.exports = function (config) {
  var couch = config.get('couch')
  var host = config.get('couch:host')
  var fullHost = couch.protocol + '://' + couch.host
  var port = config.get('couch:port')
  var database = config.get('couch:database')
  var opts = {
    cache: false,
    raw: false
  }
  var username = config.get('couch:username')
  var password = config.get('couch:password')
  if (username) {
    opts.auth = {
      username: username,
      password: password
    }
  }
  var c = new(cradle.Connection)(fullHost, port, opts)
  return c.database(database)
}
