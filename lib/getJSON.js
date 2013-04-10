var inspect = require('eyespect').inspector();
var EventEmitter = require('events').EventEmitter;
var archy = require('archy');
var propagit = require('propagit')
module.exports = function (data, cb) {
  var p = propagit(data)
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
