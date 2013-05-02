# Account Couch Logger
Log register and login requests to an account module 

# Installation

```bash
npm install -S account-couch-logger
```

# Usage
The account couch module exports `register` and `login` functions

To register a new account, pass an `email`, `password` and a cradle `db` connection
```javascript

var config = require('nconf').defaults({
  couch: {
    host: 'localhost',
    port: 5984,
    database: 'account_couch_test'
  }    
})
var logger = require('loggly-console-logger')
// instatiate an couchdb-based account backend object
var AccountCouch = require('account-couch')
var db = require('cradle-nconf')(config)
var data = {
  email: 'foo@example.com',
  password: 'barPassword',
  db: db
}

var accountCouch = new AccountCouch(db)
var AccountLogger = require('account-logger')

// instatitate the account logger object, passing  the couchdb-based account backend and the winston logger object as paramteres to the constructor
var account = new AccountLogger(accountCouch, logger)

account.register(data, function (err, reply) {
  if (err) {
    inspect(err, 'error registering user account')
    return
  }
  inspect(reply, 'account created correctly'
})
```

# Test
To run the test suite execute

```bash
# install development deps
npm install
# run tests
npm test
```

