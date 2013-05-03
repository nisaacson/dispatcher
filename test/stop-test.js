var assert = require('assert')
var async = require('async')
var cheerio = require('cheerio')
var request = require('request')
var rimraf = require('rimraf')
var should = require('should');
var fs = require('fs')
var path = require('path')
var startTestServer = require('./startTestServer')
var setupFleetHubAndDrone = require('./setupFleetHubAndDrone')
var argv = require('optimist').demand(['config']).argv
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({ file: configFilePath})

var db = require('cradle-nconf')(config)
var portFinder = require('portfinder')

var repo = 'apples'
describe('Stop Test', function () {
  var hubProcess, droneProcess
  var serverPort, server, pid
  this.timeout(0)
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
      removeExistingRepo(function (err) {
        should.not.exist(err)
        var repoURL = path.join(__dirname,'setup/repos/apples.git')
        var url = 'http://localhost:' + serverPort + '/repos/add'
        var opts = {
          method: 'post',
          form: {
            url: repoURL
          },
          url: url
        }
        request(opts, function (err, res, body) {
          should.not.exist(err, 'error adding repo: ' + JSON.stringify(err, null, ' '))
          res.statusCode.should.eql(200)
          var outputPath = path.join(__dirname, 'data/dump/addPage.html')
          fs.writeFileSync(outputPath, body)
          var $ = cheerio.load(body)
          var alert =$('.alert-success')
          alert.length.should.eql(1)

          removeExistingCommands(db, function (err) {
            should.not.exist(err)
            setupFleetHubAndDrone(config, function (err, reply) {
              should.not.exist(err)
              hubProcess = reply.hubProcess
              droneProcess = reply.droneProcess
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
                db.view('spawn_command/all', function (err, res) {
                  should.not.exist(err)
                  var commandID = res[0].id
                  should.exist(commandID, 'commandID missing')
                  var url = 'http://localhost:' + serverPort + '/spawn/' + commandID
                  var opts = {
                    url: url,
                    method: 'post'
                  }
                  request(opts, function (err, res, body) {
                    should.not.exist(err)
                    res.statusCode.should.eql(200)
                    $ = cheerio.load(body)
                    var alert = $('.alert-success')
                    alert.length.should.eql(1)
                    var alertText = alert.text().trim()
                    var pattern = /Spawned command correctly/;
                    assert.ok(pattern.test(alertText))
                    var matches = alertText.match(/spawned.*?#(.*)\)/i);
                    should.exist(matches, 'no pid match found')
                    matches.length.should.eql(2, 'wrong number of pid matches')
                    pid = matches[1]
                    should.exist(pid)
                    done()
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  after(function () {
    hubProcess.kill()
    droneProcess.kill()
  })

  it('should stop pid', function (done) {
    should.exist(pid)
    var url = 'http://localhost:' + serverPort + '/ps/stop/' + pid
    var opts = {
      url: url,
      method: 'get'
    }
    request(opts, function (err, res, body) {
      should.not.exist(err)
      res.statusCode.should.eql(200)
      var $ = cheerio.load(body)
      var alert = $('.alert-success')
      var filePath = path.join(__dirname, 'data/dump/stop.html')
      fs.writeFileSync(filePath, body)
      alert.length.should.eql(1)
      var alertText = alert.text().trim()
      var pattern = /correctly stopped pid:/;
      assert.ok(pattern.test(alertText))
      done()
    })
  })
})

function removeExistingRepo(cb) {
  var dir = path.join(__dirname,'../repos/apples')
  var exists = fs.existsSync(dir)
  if (!exists) {
    return cb()
  }
  rimraf(dir, cb)
}
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
