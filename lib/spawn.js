var config = require('nconf')
var db = require('cradle-nconf')(config)
var performSpawn = require('./performSpawn')
module.exports = function (req, res) {
  var id = req.params.id
  db.get(id,function (err, reply) {
    if (err) {
      req.session.error = 'Spawn failed, command not found with id: ' + id + ', error: ' + err
    }
    var spawnCommand = reply.json
    performSpawn(spawnCommand, function (err, reply) {
      if (err) {
        delete err.stack
        req.session.error = 'Error performing spawn: ' + JSON.stringify(err, null, ' ')
      }
      else {
        req.session.success = 'Spawned command correctly. Response: ' + reply
      }
      res.redirect('/commands')
    })
  })
}
