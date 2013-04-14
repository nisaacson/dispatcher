var inspect = require('eyespect').inspector();
var prompt = require('prompt')
var fs = require('fs')
var rk = require('required-keys');
var path = require('path')
module.exports = function (data, cb) {
  var keys = ['host', 'protocol', 'database', 'port']
  var err = rk.truthySync(data, keys)
  if (err) {
    return cb({
      message: 'failed to create config.json, missing key in data',
      error: err,
      stack: new Error().stack
    })
  }
  var configFilePath = path.join(__dirname, 'configs/config.json')
  confirmOverwrite(configFilePath, function (err) {
    if (err) { return cb(err) }
    var configData = {
      couch: data
    }
    var configString = JSON.stringify(configData)
    inspect(configData, 'configData')
    fs.writeFile(configFilePath, configString)
  })
}

function confirmOverwrite(filePath, cb) {
  fs.exists(filePath, function (exists) {
    if (!exists) {
      return cb()
    }
    prompt.start();
    prompt.get({
      properties: {
        confirm: {
          description: "config.json file already exists at path: ' + filePath + '. Are you sure you want to overwrite? [yes/no]".green
        }
      }
    }, function (err, result) {
      var confirm = result.confirm
      var confirmed = false
      if (confirm !== 'yes' && confirm !== 'y') {
        return cb({
          message: 'install failed',
          error: 'declined to overwrite config file at path: ' + filePath
        })
      }
      cb()
    })
  })
}
