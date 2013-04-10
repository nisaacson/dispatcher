var upnode = require('../../');

upnode(function (client, conn) {
    this.time = function (cb) { cb(new Date().toString()) };
}).listen(7000);
