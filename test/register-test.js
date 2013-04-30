require('./startTestServer')
var cheerio = require('cheerio')
var async = require('async')
var fs = require('fs')
var assert = require('assert')
var should = require('should');
var inspect = require('eyespect').inspector();
var configFilePath = require('optimist').demand('config').argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var db = require('cradle-nconf')(config)
var port = config.get('portRange')[0]
var request = require('request')
describe('Register', function () {
  var data = {
    email: 'user1@example.com',
    password: 'password1',
    db: db
  }

  var user2 = {
    email: 'user2@example.com',
    password: 'password2',
    db: db

  }
  it('should register new user correctly', function (done) {
    var email = data.email
    inspect('removing existing users')
    removeForEmail(email, function (err) {
      should.not.exist(err)
      inspect('existing users removed')
      var jar = request.jar()
      var url = 'http://127.0.0.1:' + port + '/register'
      var opts = {
        form: {
          email_field: email,
          password_field: data.password,
          password_confirm_field: data.password
        },
        jar: jar,
        method: 'post',
        url: url
      }
      request(opts, function (err, res, body) {
        should.not.exist(err)
        res.statusCode.should.eql(200)
        var $ = cheerio.load(body)
        var html = $.html('html')
        inspect(html,'html')
        done()
      })
    })
  })
  it('should give error when registering user with same email')
})


function removeForEmail(email, callback) {
  db.view('user_profile/byEmail', {key: email}, function (err, res) {
    should.not.exist(err, 'error removing profiles: ' + JSON.stringify(err, null, ' '))
    if (res.length === 0) {
      return callback()
    }
    async.forEachSeries(
      res,
      function (doc, cb) {
        doc = doc.value
        var id = doc._id
        var rev = doc._rev
        db.remove(id, rev, cb)
      }, callback)
  })
}
