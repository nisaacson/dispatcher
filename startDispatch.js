var should = require('should');
var path = require('path');
var install = require('./spinup-install')
var rebuild = require('spinup-rebuild')
var serverPath = path.join(__dirname)
process.chdir(serverPath)
install(function (err, reply) {
  should.not.exist(err, 'error installing node modules: ' + JSON.stringify(err, null, ' '))
  rebuild(function (err, reply) {
    should.not.exist(err, 'error rebuilding node modules: ' + JSON.stringify(err, null, ' '))
    require('./start')
  })
})
