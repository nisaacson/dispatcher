var argv = require('optimist').demand('port').argv
var express = require('express')
var http = require('http')
var port = argv.port
var app = express()
app.use(app.router)
app.get('/ping', function (req, res) {
  res.send('pong')
})
var server = http.createServer(app)
server.listen(port, function (err, reply) {
  console.log('apples server listening on port: ' + port)
})
