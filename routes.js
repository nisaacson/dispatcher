var hub = require('./lib/hub')
module.exports = function (app) {
   app.get('/ping', function (req, res) {
    res.send('pong')
  })
  app.get('/hub', hub) 
}


