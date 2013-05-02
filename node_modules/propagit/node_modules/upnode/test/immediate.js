var upnode = require('../');
var dnode = require('dnode');
var test = require('tap').test;

test('immediate connection', function (t) {
    t.plan(1);
    
    var port = Math.floor(Math.random() * 5e4 + 1e4);
    var server = upnode({
        beep : function (cb) { cb('boop') }
    });
    
    server.listen(port, function () {
        var up = upnode.connect(port);
        up(function (remote, conn) {
            remote.beep(function (s) {
                t.equal(s, 'boop');
                t.end();
                up.close();
                server.close();
            });
        });
    });
});
