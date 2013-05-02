var config = require('nconf').defaults({
  test: true
})

var logger = require('../index')
describe('Logger test', function () {
  it('should log to console', function () {
    logger.debug('logger test')
  })
})
