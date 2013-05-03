var inspect = require('eyespect').inspector();
var should = require('should');
var portFinder = require('portfinder')
var startHub = require('./setup/startHub')
var startDrone = require('./setup/startDrone')
module.exports = function (config, cb) {
  portFinder.getPort(function (err, port) {
    should.not.exist(err, 'error getting random port: ' + JSON.stringify(err, null, ' '))
    var host = 'localhost'
    var secret = 'foo_secret'
    var data = {
      host: host,
      port: port,
      secret: secret
    }
    config.set('fleet:port', port)
    config.set('fleet:host', host)
    config.set('fleet:secret', secret)
    var hubProcess = startHub(data)
    var droneProcess = startDrone(data)
    droneProcess.stdout.on('data', function (data) {
      inspect(data, 'drone data')
      if (data.trim() === 'connected to the hub') {
        var output = {
          host: host,
          port: port,
          secret: secret,
          hubProcess: hubProcess,
          droneProcess: droneProcess
        }
        cb(null, output)
      }
    })
  })
}
