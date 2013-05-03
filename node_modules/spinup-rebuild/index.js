var spawn = require('child_process').spawn
module.exports = function (cb) {
  var child = spawn('npm', ['rebuild'], { stdio: 'inherit' })
  child.on('exit', function (code) {
    if (code !== 0) {
      return cb({
        message: 'error rebuilding',
        error: 'bad exit code',
        code: code,
        stack: new Error().stack
      })
    }
    cb()
  })
}
