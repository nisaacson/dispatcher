# Fleet Get PS
Get the running fleet processes as an object. The output is the same as running `fleet-ps` but is returned as an object rather than a string

# Installation

```bash
npm install -S fleet-get-ps
```

# Usage

```javascript
var getPS = require('fleet-get-ps')
var data = {
  host: 'localhost',   // fleet hub host
  port: 7000,          // fleet hub port
  secret: 'foo_secret, // fleet hub secret
}
getPS(data, function (err, reply) {
  if (err) {
    inspect(err, 'error getting fleet ps data')
    return
  }
  inspect(reply, 'fleet ps data')
})
```

# Test

```bash
# install the development dependencies
npm install
# run the tests
npm test
```
