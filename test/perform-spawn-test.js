var cheerio = require('cheerio')
var request = require('request')
var rimraf = require('rimraf')
var inspect = require('eyespect').inspector();
var should = require('should');
var fs = require('fs')
var path = require('path')
var startTestServer = require('./startTestServer')
var repo = 'apples'
describe('Add Repo', function () {
  var port, server
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
      port = reply.port
      removeExistingRepo(function (err) {
        should.not.exist(err)
        var repoURL = path.join(__dirname,'setup/repos/apples.git')
        var url = 'http://localhost:' + port + '/repos/add'
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
          done()
        })
      })
    })
  })

  it('should spawn command', function () {

  })
})

function removeExistingRepo(cb) {
  var dir = path.join(__dirname,'../repos/apples')
  inspect(dir,'dir')

  var exists = fs.existsSync(dir)
  if (!exists) {
    return cb()
  }
  rimraf(dir, cb)
}
