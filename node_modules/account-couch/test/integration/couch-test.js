var inspect = require('eyespect').inspector();
var should = require('should');
var async = require('async')
var fs = require('fs')
var assert = require('assert')
var configFilePath = require('optimist').demand('config').argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var db = require('cradle-nconf')(config)

var AccountCouch = require('../..')
var account = new AccountCouch(db)
describe('Account Couch', function () {
  var testLib = require('account-test')
  var profile = {
    email: 'foo@example.com',
    password: 'barPassword'
  }
  testLib(account, profile)
})

function removeAll(email, callback) {
  db.view('user_profile/all', function (err, res) {
    inspect(res.length, 'num user profiles to remove')
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
