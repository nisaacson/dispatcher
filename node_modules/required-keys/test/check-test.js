var inspect = require('eyespect').inspector()
var should = require('should')
var rk = require('../index')
describe('Check Required Keys', function(done) {
  it('should pass async truthy  when all keys map to true values', function (done) {
    var keys = ['dog', 'cat', 'lemon']
    var data = {
      dog: 'dog',
      cat: 'cat',
      lemon: 'lemon'
    }
    rk.truthy(data, keys, function (err, reply) {
      should.not.exist(err, 'truthy error: ' + err)
      done()
    })
  })

  it('should fail async truthy  when all not all keys map to true values', function (done) {
    var keys = ['dog', 'cat', 'lemon']
    var data = {
      dog: 'dog',
      cat: 'cat',
      lemon: false
    }
    rk.truthy(data, keys, function (err, reply) {
      should.exist(err, 'truthy error should exist')
      err[0].key.should.eql('lemon')
      done()
    })
  })

  it('should pass truthySync when all all keys map to values', function () {
    var keys = ['dog', 'cat', 'lemon']
    var data = {
      dog: 'dog',
      cat: 'cat',
      lemon: true,
      apple: ''
    }
    var err = rk.truthySync(data, keys)
    should.not.exist(err, 'truthy error should exist')
  })

  it('should fail truthySync not when all all keys map to values', function () {
    var keys = ['dog', 'cat', 'lemon']
    var data = {
      dog: 'dog',
      lemon: false,
      apple: ''
    }
    var err = rk.truthySync(data, keys)
    should.exist(err, 'truthy error should exist')
    err.length.should.eql(2)
    err[0].key.should.eql('cat')
    should.not.exist(err[0].value)
    err[1].key.should.eql('lemon')
    err[1].value.should.eql(data.lemon)
  })

  it('should pass nonNullSync  when all all keys map to non-null values', function () {
    var keys = ['dog', 'cat', 'lemon']
    var data = {
      dog: 'dog',
      cat: 'cat',
      lemon: false
    }
    var err = rk.nonNullSync(data, keys)
    should.not.exist(err)
  })

  it('should pass fail nonNullSync when all not all keys map to non-null values', function () {
    var keys = ['dog', 'cat', 'lemon']
    var data = {
      dog: undefined,
      lemon: null
    }
    var err = rk.nonNullSync(data, keys)
    should.exist(err)
    err[0].key.should.eql('dog')
    should.not.exist(err[0].value)
    err[1].key.should.eql('cat')
    should.not.exist(err[1].value)
    err[2].key.should.eql('lemon')
    should.not.exist(err[2].value)
  })


  it('should pass keysOnlySync when all all keys are set', function () {
    var keys = ['dog', 'cat', 'lemon']
    var data = {
      dog: null,
      cat: undefined,
      lemon: false,
      fruit: 'banana'
    }
    var err = rk.keysOnlySync(data, keys)
    should.not.exist(err)
  })
  it('should fail keysOnlySync when not all not keys are set', function () {
    var keys = ['dog', 'cat', 'lemon']
    var data = {
      dog: null,
      cat: undefined,
      fruit: 'banana'
    }
    var err = rk.keysOnlySync(data, keys)
    should.exist(err)
    err[0].key.should.eql('lemon')
  })
})
