var upnode = require('../../');
var up = upnode.connect(7000);

setInterval(function () {
    up(function (remote) {
        remote.time(function (t) {
            console.log('time = ' + t);
        });
    });
}, 1000);
