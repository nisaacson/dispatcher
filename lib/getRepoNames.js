var async = require('async')
var fs = require('fs')
var path = require('path')
module.exports = function getRepoNames(cb) {
  var repoDir = path.join(__dirname, '../repos')
  fs.readdir(repoDir, function (err, list) {
    if (err) {
      return cb({
        message: 'failed to get repo names',
        error: err,
        stack: new Error().stack
      })
    }
    async.filter(
      list,
      function(file, cb) {
        var filePath = path.join(repoDir, file)
        fs.stat(filePath, function (err, stat) {
          return cb(stat.isDirectory())
        })
      },
      function(dirs) {
        cb(null, dirs)
      }
    )
  })
}
