var inspect = require('eyespect').inspector();
var EventEmitter = require('events').EventEmitter;
var archy = require('archy');
var propagit = require('propagit')
module.exports = function (data, cb) {
  var port = data.port
  var host = data.host
  var secret = data.secret
  var hub = [host, port].join(':')
  var params = {
    hub: hub,
    secret: secret
  }
  var p = propagit(data)
  if (!p || !p.hub) {
    return cb(null, {})
  }
  p.hub.on('up', function (hub) {
    var em = new EventEmitter
    var output = {}
    em.on('data', function (key, procs) {
      output[key] = procs
    });

    em.on('end', function () {
      p.hub.close();
      cb(null, output)
    });
    hub.ps(em.emit.bind(em));
  })
}
