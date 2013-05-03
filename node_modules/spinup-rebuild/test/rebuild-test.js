var should = require('should');
var memwatch = require('memwatch')
var rebuild = require('../index')
describe('Rebuild Test', function () {
  this.slow('1s')
  this.timeout('3s')
  it('should rebuild correctly', function (done) {
    var opts = {
      logOutput: true
    }
    rebuild(done)
  })
})
