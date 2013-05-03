# Spinup Rebuild
Rebuild binary dependecies when starting your app

# Installation
```bash
npm install spinup-rebuild
```

# Usage
var should = require('should')
var spinupRebuild = require('spinup-rebuild')
var inspect = require('eyespect').inspector()
rebuildAndStart(function(err) {
  should.not.exist(err, 'error rebuilding and starting application: ' + JSON.stringify(err))
  inspect('startup complete')
})
function rebuildAndStart(cb) {
spinupRebuild(function(err) {
  if (err) { return cb(err) }
  console.log('rebuild complete')
  // now start the rest of your application which depends on binary modules

  // for example memwatch will only work if it has been compiled for your target platform
  var memwatch = require('memwatch')
  start(cb)
})

/**
 * Trivial startup function which just takes a heap dump and returns
 * This is just meant to illustrate using a binary module which must be compiled before your app can fun
 */
function start(cb) {
  var hd = new memwatch.HeapDiff();
  var diff = hd.end();
  inspect(diff, 'heap diff')
  cb()
}
