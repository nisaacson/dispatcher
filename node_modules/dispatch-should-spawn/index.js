var inspect = require('eyespect').inspector();
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
    psCommands = drones.reduce(function (a, b) {
      return a.concat(b)
    }, [])
    var elements = psCommands.map(function (e) {
      var pids = Object.keys(e)
      var commands = pids.map(function (pid) {
        var p = e[pid]
        var command = p.command.join(' ')
        return command
      })
      return commands
    })
    var commands = elements.reduce(function (a, b) {
      return a.concat(b)
    }, [])
    var instances = countInstances(command, commands)
    inspect(instances,'instances')
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
