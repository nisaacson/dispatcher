# Dispatch Should Spawn
Test if a dispatch fleet command is already spawned the allotted number of instances

# Installation

```bash
npm install -S dispatch-should-spawn
```

# Usage

```javascript
var shouldSpawn = require('dispatch-should-spawn')
// record is a dispatch spawn command fetch from the couchdb database
var record = {
  host: 'localhost',     // fleet hub host
  port: 7000,            // fleet hub port
  secret: 'foo_secret',  // fleet hub secret
  command: 'node startServer.js',
  instances: 4 // only spawn up to 4 instances of "node startServer.js" processes
  drone: 'fooDrone' // always spawn this command on drone with name "fooDrone"
}

shouldSpawn(record, function (err, reply) {
  if (err) {
    inspect(err, 'error checking if dispatch should should spawn command')
    return
  }
  // reply will either be true or false
  inspect(reply, 'should command be spawned')
})
```

# Test

```bash
# install development dependencies
npm install
# run tests
npm test
```
