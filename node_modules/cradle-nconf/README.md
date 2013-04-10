Setup a basic cradle connection using the global nconf object

# Installation
```bash
npm install -S cradle-nconf
```

# Usage

```js
var config = require('nconf').defaults({
  couch: {
    host: 'localhost',
    port: 5948,
    protocol: 'http'
  }
})
var db = require('cradle-nconf')(config)
```
