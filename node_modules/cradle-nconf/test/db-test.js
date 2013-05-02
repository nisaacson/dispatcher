var inspect = require('eyespect').inspector();
var should = require('should');
var config = require('nconf').defaults({
  couch: {
    host: 'localhost',
    port: 5948,
    database: 'cradle_test',
    protocol: 'http'
  }
})


describe('Get db connection', function () {
  it('should get db', function () {
    should.exist(config.get('couch'))
    var db = require('../index')
  })
})
