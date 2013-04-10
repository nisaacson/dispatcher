var hub = require('./lib/hub')
var ps = require('./lib/ps')
var repos = require('./lib/repos')
var addRepo = require('./lib/addRepo')
module.exports = function (app) {
   app.get('/ping', function (req, res) {
    res.send('pong')
  })
  app.get('/hub', hub) 
  app.get('/ps', ps) 
  app.get('/repos', repos) 
  app.get('/repo/add', addRepo) 
  app.post('/repo/add', addRepo) 
}


