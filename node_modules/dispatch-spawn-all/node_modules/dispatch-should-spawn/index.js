var getPS = require('fleet-get-ps')
module.exports = function (data, cb) {
  var drone = data.drone
  var command = data.command
  var psData = {
    host: data.host,
    port: data.port,
    secret: data.secret
  }
  getPS(psData, function (err, ps) {
    if (err) { return cb(err) }
    var psCommands
    var drones = Object.keys(ps).map(function (droneKey) {
      var drone = ps[droneKey]
      return drone
    })
    if (drone) {
      psCommands = ps[drone]
    }
    else {
      psCommands = drones.reduce(function (a, b) {
        return a.concat(b)
      }, [])
    }
    psCommands = psCommands.filter(function (e) {
      var keys = Object.keys(e)
      return keys.length
    })
    var commands = psCommands.reduce(function (a, b) {
      var keys = Object.keys(b)
      var key = keys[0]
      var element = b[key]
      var command = element.command
      command = command.join(' ')
      a.push(command)
      return a
    }, [])
    var instances = countInstances(command, commands)

    var spawnNeeded = false
    if (instances < data.instances) {
      spawnNeeded = true
    }
    cb(null, spawnNeeded)
  })
}

function countInstances(command, psCommands) {
  var instances = psCommands.filter(function (testCommand) {
    return testCommand === command
  })
  return instances.length
}
