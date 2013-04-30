var inspect = require('eyespect').inspector();
var prompt = require('prompt')
prompt.start();
prompt.get({
  properties: {
    confirm: {
      description: "Would you like to setup dispatcher? [yes/no]".green
    }
  }
}, function (err, result) {
  var confirm = result.confirm
  var confirmed = false
  if (confirm !== 'yes' && confirm !== 'y') {
    console.log('Aborted!')
    process.exit()
    return
  }

  prompt.get({
    properties: {
      database: {
        description: "Enter database name".green
      },
      host: {
        description: "Enter couchdb host".green
      },
      port: {
        description: "Enter couchdb port".green
      },
      username: {
        description: "Enter couchdb username (optional)".green
      },
      password: {
        description: "Enter couchdb password (optional)".green
      },
      protocol: {
        description: "Enter couchdb protocol [http/https]".green
      }
    }
  }, function (err, result) {
    inspect(result,'result')
    var confirm = result.confirm
    var confirmed = false
    var protocol = result.protocol

    if (protocol !== 'http' && confirm !== 'https') {
      inspect(protocol, 'protocol must be either http or https and you entered')
      process.exit()
      return
    }
    var host = result.host
    var username = result.username
    var password = result.password
    var port = result.port
    var portPattern = /\d+/
    if (!portPattern.test(port)) {
      inspect(port, 'invalid port')
      process.exit()
      return
    }
    var data = {
      protocol: protocol,
      port: port,
      host: host,
      username: username,
      password: password
    }
    inspect(data, 'setting up dispatcher with data')
    prompt.get({
      properties: {
        confirm: {
          description: "Is this all okay? [yes/no]".green
        }
      }
    }, function (err, result) {
      var confirm = result.confirm
      var confirmed = false
      if (confirm !== 'yes' && confirm !== 'y') {
        console.log('Aborted!')
        process.exit()
        return
      }
      inspect(data, 'creating config')
    })
  })
})
