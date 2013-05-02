var request = require('request')
var path = require('path')
var fs = require('fs')
var assert = require('assert')
var inspect = require('eyespect').inspector();
var portFinder = require('portfinder')
var should = require('should')
var performSpawn = require('../')
var startHub = require('./setup/startHub')
var startDrone = require('./setup/startDrone')
describe('Spawn', function () {
  this.timeout(0)
  this.slow('10s')
  var hubProcess, droneProcess
  var port
  var host = 'localhost'
  var secret = 'foo_secret'
  before(function (done) {
    portFinder.getPort(function (err, reply) {
      port = reply
      should.not.exist(err, 'error getting random port: ' + JSON.stringify(err, null, ' '))
      var data = {
        host: host,
        port: port,
        secret: secret
      }
      hubProcess = startHub(data)
      droneProcess = startDrone(data)
      droneProcess.stdout.on('data', function (data) {
        inspect(data, 'drone data')
        if (data.trim() === 'connected to the hub') {
          done()
        }
      })
    })
  })

  after(function () {
    hubProcess.kill()
    droneProcess.kill()
  })

  it('should spawn command correctly', function (done) {
    portFinder.getPort(function (err, serverPort) {
      should.not.exist(err, 'error getting server port: ' + JSON.stringify(err, null, ' '))
      var repoDir = path.join(__dirname, 'setup/repos/apples/');
      assert.ok(fs.existsSync(repoDir) ,'repo dir not found at path: ' + repoDir)
      var data = {
        port: port,
        host: host,
        secret: secret,
        repoDir: repoDir,
        command: 'node applesServer --port=' + serverPort
      }
      performSpawn(data, function (err) {
        should.not.exist(err, 'error spawning command: ' + JSON.stringify(err, null, ' '))
      })
      var pattern = /apples server listening on port/;
      droneProcess.stdout.on('data', function (stdoutData) {
        if (pattern.test(stdoutData)) {
          var url = 'http://localhost:' + serverPort + '/ping'
          inspect(url,'url')
          request(url, function (err, res, body) {
            if (err) {
              inspect(err, 'server error')
            }
            should.not.exist(err, 'error in server response: ' + JSON.stringify(err, null, ' '))
            res.statusCode.should.eql(200)
            body.should.eql('pong')
            done()
          })
        }
      })
    })
  })
})
