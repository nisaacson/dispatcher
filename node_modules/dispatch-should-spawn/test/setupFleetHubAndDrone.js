var inspect = require('eyespect').inspector();
var should = require('should');
var portFinder = require('portfinder')
var startHub = require('./setup/startHub')
var startDrone = require('./setup/startDrone')
module.exports = function (cb) {
  portFinder.getPort(function (err, port) {
    should.not.exist(err, 'error getting random port: ' + JSON.stringify(err, null, ' '))
    var host = 'localhost'
    var secret = 'foo_secret'
    var data = {
      host: host,
      port: port,
      secret: secret
    }
    var hubProcess = startHub(data)
    var droneProcess = startDrone(data)
    droneProcess.stdout.on('data', function (data) {
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
