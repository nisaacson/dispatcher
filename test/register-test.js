var inspect = require('eyespect').inspector();
var path = require('path')
require('./startTestServer')
var cheerio = require('cheerio')
var async = require('async')
var fs = require('fs')
var assert = require('assert')
var should = require('should');
var configFilePath = require('optimist').demand('config').argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var db = require('cradle-nconf')(config)
var port = config.get('portRange')[0]
var request = require('request')
describe('Register', function () {
  this.timeout('200s')
  this.slow('20s')
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
    removeForEmail(email, function (err) {
      should.not.exist(err)
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
        url: url,
        followAllRedirects: true
      }
      request(opts, function (err, res, body) {
        should.not.exist(err)
        var $ = cheerio.load(body)
        var html = $.html('html')
        var div = $('.alert-success')
        div.length.should.eql(1, 'success alert not found')
        var text = div.text().trim()
        text.should.eql('xYour registration was sucessful. Please login now')
        var url = 'http://127.0.0.1:' + port + '/login'
        var form = {
          email: email,
          password: data.password
        }
        confirmForEmail(email, function (err) {
          should.not.exist(err, 'error confirming profile')
          var opts = {
            form: form,
            jar: jar,
            method: 'post',
            url: url,
            followAllRedirects: true
          }
          request(opts, function (err, res, body) {
            should.not.exist(err)
            res.statusCode.should.eql(200, 'incorrect status code')
            should.exist(body, 'no body returned')
            var $ = cheerio.load(body)
            var logoutLink = $('a:contains("Logout")')
            logoutLink.length.should.eql(1, 'Logout link not found')
            done()
          })
        })
      })
    })
  })
  it('should give error when registering user with same email', function (done) {
    var email = data.email
    removeForEmail(email, function (err) {
      should.not.exist(err)
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
        url: url,
        followAllRedirects: true
      }
      request(opts, function (err, res, body) {
        should.not.exist(err)
        var $ = cheerio.load(body)
        var html = $.html('html')
        var div = $('.alert-success')
        div.length.should.eql(1, 'success alert not found')
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
          url: url,
          followAllRedirects: true
        }
        request(opts, function (err, res, body) {
          should.not.exist(err)
          var $ = cheerio.load(body)
          var html = $.html('html')
          var div = $('.alert-error')
          div.length.should.eql(1, 'error alert not found')
          var text = div.text().trim()
          text.should.eql('xEmail address is already registered, please enter a different one')
          done()
        })
      })
    })
  })
})
function confirmForEmail(email, callback) {
  db.view('user_profile/byEmail', {key: email}, function (err, res) {
    should.not.exist(err, 'error removing profiles: ' + JSON.stringify(err, null, ' '))
    res.length.should.eql(1, 'wrong number of profiles found')
    var doc = res[0].value
    doc.confirmed = true
    var id = doc._id
    var rev = doc._rev
    db.save(id, rev, doc, callback)
  })
}


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
