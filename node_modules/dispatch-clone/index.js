var exec = require('child_process').exec
var inspect = require('eyespect').inspector();
var fs = require('fs')
var path = require('path')
var rk = require('required-keys');
module.exports = function getRepoNames(data, cb) {
  var keys = ['containerDir', 'url']
  var err = rk.truthySync(data, keys)
  if (err) {
    return cb({
      message: 'failed to clone repo, missing key in data',
      error: err,
      stack: new Error().stack
    })
  }
  var containerDir = data.containerDir
  fs.stat(containerDir, function (err, stats) {
    if (err) {
      return cb({
        message: 'failed to clone repo, error checking if containerDir is a writable directory',
        error: err,
        stack: new Error().stack
      })
    }
    process.chdir(containerDir)
    var url = data.url
    var cmd = 'git clone ' + url
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        return cb({
          message: 'error cloning repo',
          command: cmd,
          error: err,
          stdout: stdout,
          stderr: stderr,
          stack: new Error().stack
        })
      }
      if (stderr) {
        return cb({
          message: 'error cloning repo',
          command: cmd,
          error: stderr,
          stack: new Error().stack
        })
      }
      cb()
    })
  })
}
