var async = require('async')
var cheerio = require('cheerio')
var request = require('request')
var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var startTestServer = require('./startTestServer')
var assert = require('assert')
var argv = require('optimist').demand(['config']).argv
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({ file: configFilePath})



var db = require('cradle-nconf')(config)
var portFinder = require('portfinder')
var startHub = require('./setup/startHub')
var startDrone = require('./setup/startDrone')
var repo = 'apples'
var hubProcess, droneProcess
describe('Add Repo', function () {
  var port, server, serverPort
  var host = 'localhost'
  var secret= 'foo_secret'
  after(function () {
    if (server) {
      server.close()
    }
  })
  before(function (done) {
    var serverData = {
      authWare: function (req, res, next) {
        next()
      }
    }
    startTestServer(serverData, function (err, reply) {
      should.not.exist(err, 'error staring server: ' + JSON.stringify(err, null, ' '))
      server = reply.server
      serverPort = reply.port
      removeExistingCommands(db, function (err, reply) {
        portFinder.getPort(function (err, reply) {
          port = reply
          should.not.exist(err, 'error getting random port: ' + JSON.stringify(err, null, ' '))
          var data = {
            host: host,
            port: port,
            secret: secret
          }
          config.set('fleet:port', port)
          config.set('fleet:host', host)
          config.set('fleet:secret', secret)
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
    })
  })
  after(function () {
    hubProcess.kill()
    droneProcess.kill()
  })

  it('should add new command', function (done) {
    var url = 'http://localhost:' + serverPort + '/commands/add'
    var opts = {
      method: 'post',
      form: {
        drone: '0',
        repo: '1',
        command: 'node applesServer.js',
        instances: '1'
      },
      url: url
    }
    request(opts, function (err, res, body) {
      var statusCode = res.statusCode
      should.not.exist(err, 'error adding repo: ' + JSON.stringify(err, null, ' '))
      res.statusCode.should.eql(200)
      var $ = cheerio.load(body)
      var alert =$('.alert-success')
      alert.length.should.eql(1)
      var alertText = alert.text().trim()
      alertText.should.eql('xCommand added correctly')
      done()
    })
  })
})

function removeExistingCommands(db, callback) {
  var opts = {
    include_docs: true
  }
  db.view('spawn_command/all', opts, function (err, res) {
    should.not.exist(err, 'error removing existing commands: ' + JSON.stringify(err, null, ' '))
    if (res.length === 0) {
      return callback()
    }
    async.forEachSeries(
      res,
      function (element, cb) {
        var doc = element.doc
        var id = doc._id
        var rev = doc._rev
        should.exist(id)
        should.exist(rev)
        db.remove(id, rev, cb)
      },
      callback
    )
  })
}
