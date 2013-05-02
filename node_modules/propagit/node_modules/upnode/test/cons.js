var upnode = require('../');
var test = require('tap').test;

test('constructor', function (t) {
    t.plan(2);
    var port = Math.floor(Math.random() * 5e4 + 1e4);
    
    var up = upnode(function () {
        this.beep = 5;
    }).connect(port);
    
    var server = upnode(function (remote, conn) {
        this.boop = 6;
        
        conn.on('ready', function () {
            t.equal(remote.beep, 5);
        });
    });
    server.listen(port);
    
    up(function (remote) {
        t.equal(remote.boop, 6);
    });
    
    t.on('end', function () {
        up.close();
        server.close();
    });
});
