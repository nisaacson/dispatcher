var should = require('should')
var rewire = require('rewire')
describe('Spawn All', function () {
  it('should spawn all commands', function (done) {
    var spawnAll = rewire('../')
    var spawnCount = 0
    spawnAll.__set__('spawn', function (data, cb) {
      spawnCount += 1
      cb()
    })
    spawnAll.__set__('shouldSpawn', function (data, cb) {
      cb(null, true)
    })
    var commands = [
      {
        host: 'localhost',
        port: 7000,
        secret: 'foo_secret',
        command: 'echo "hello world"',
        repoDir: 'apples'
      }
    ]
    spawnAll(commands, function (err) {
      should.not.exist(err, 'error spawning commands: ' + JSON.stringify(err, null, ' '))
      spawnCount.should.eql(commands.length)
      done()
    })
  })
})
