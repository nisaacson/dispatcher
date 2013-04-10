var upnode = require('../../');
var up = upnode.connect(7000, function (remote, conn) {
    remote.auth('moo', 'hax', function (err, res) {
        if (err) console.error(err)
        else conn.emit('up', res)
    });
});

setInterval(function () {
    up(function (remote) {
        remote.beep(function (s) {
            console.log(s);
        });
    });
}, 1000);
