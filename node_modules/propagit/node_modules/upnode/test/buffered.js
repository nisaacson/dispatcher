var upnode = require('../');
var dnode = require('dnode');
var test = require('tap').test;
var net = require('net');

test('buffered connections', function (t) {
    t.plan(5);
    var port = Math.floor(Math.random() * 5e4 + 1e4);
    var up = upnode.connect(port);
    
    var messages = [];
    for (var i = 0; i < 5; i++) {
        setTimeout(function () {
            up(function (remote) {
                remote.time(function (time) {
                    t.ok(time);
                });
            });
        }, 2000);
    }
    
    var server = net.createServer(function (stream) {
        setTimeout(function () {
            stream.end();
        }, 300);
        
        var ds = dnode(function (client, conn) {
            this.time = function (cb) { cb(Date.now()) };
            this.ping = function (cb) { cb() };
        });
        ds.pipe(stream).pipe(ds);
    });
    server.listen(port);
    
    t.on('end', function () {
        server.close();
        up.close();
    });
});
