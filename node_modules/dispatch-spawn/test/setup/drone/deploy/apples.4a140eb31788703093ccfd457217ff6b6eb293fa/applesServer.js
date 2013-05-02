var argv = require('optimist').demand('port').argv
var http = require('http')
var port = argv.port
var server = http.createServer(function (req, res) {
  res.writeHead(200)
  res.end('apple hello world')
})
server.listen(port, function (err, reply) {
  console.log('apples server listening on port: ' + port)
})
