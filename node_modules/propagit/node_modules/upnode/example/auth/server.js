var upnode = require('../../');

var server = upnode(function (client, conn) {
    this.auth = function (user, pass, cb) {
        if (user === 'moo' && pass === 'hax') {
            cb(null, {
                beep : function (fn) { fn('boop at ' + new Date) }
            });
        }
        else cb('ACCESS DENIED')
    };
}).listen(7000);
