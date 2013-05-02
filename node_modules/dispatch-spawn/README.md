# Dispatch Spawn
Execute fleet-spawn in a given git repo

[![Build Status](https://travis-ci.org/nisaacson/dispatch-spawn.png)](https://travis-ci.org/nisaacson/dispatch-spawn)


# Installation

```bash
npm install -S dispatch-spawn
```

# Usage

To spawn a command, pass all the required parameters to the dispatch-spawn module

```javascript
var inspect = require('eyespect').inspector();
var dispatchSpawn = require('dispatch-spawn')
var repoDir = '/path/to/checked/out/repo'
var command = 'node startServer.js'  // command to spawn
var host = 'localhost' // fleet hub host
var port = 4002 // fleet hub port
var secret = 'foo_secret' // fleet hub secret

var data = {
  repoDir: repoDir,
  host: host,
  port: port,
  secret: secret,
  command: command
}
dispatchSpawn(data, function (err) {
  if (err) {
    console.log(err.stack)
    delete err.stack
    inspect(err, 'error spawning command')
    return
  }
  inspect('command spawned correctly')
})
```

# Test
