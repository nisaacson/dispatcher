# Account Couch
Implement the account interface using a couchdb backend with the couch-profile module

[![Build Status](https://travis-ci.org/nisaacson/account-couch.png?branch=master)](https://travis-ci.org/nisaacson/account-couch)
[![Dependency Status Status](https://david-dm.org/nisaacson/account-couch.png)](https://david-dm.org/nisaacson/account-couch)

# Installation
Install the module by executing
```bash
npm install -S account-couch
```

You will also need the views provided by the [couch-profile](https://github.com/nisaacson/couch-profile) module. You can add these to your couchdb database using the [couchdb-update-views](https://github.com/nisaacson/couchdb-update-views) module.

```bash
# create a couchdb database named account_couch_test
curl -X PUT localhost:5984/account_couch_test
# install the couchdb-update-views module globally so the couchdb-update-views command is available on the command line
npm install -g couchdb-update-views
# add the couch-profile views to the newly created account_couch_test database
couchdb-update-views --config test/config.json --docsDir node_modules/couch-profile/docs
```

You can perform the steps listed above by executing the travis before_install script with the command

```bash
script/createDatabase.sh
script/createViews.sh
```


# Usage
The account couch module implements and exports the following interface functions:

* `login`
* `register`
* `serializeUser`
* `deserializeUser`
* `removeUser`


## Register

To register a new account, pass an object with an `email`,  and a `password`

```javascript
var Account = require('account-couch')
var config = require('nconf').defaults({
  couch: {
    host: 'localhost',
    port: 5984,
    database: 'account_couch_test'
  }    
})
var db = require('cradle-nconf')(config)
// create the account object with the cradle db passed as a parameter to the constructor
var account = new Account(db)
var data = {
  email: 'foo@example.com',
  password: 'barPassword',
}
account.register(data, function (err, reply) {
  if (err) {
    inspect(err, 'error registering user account')
    return
  }
  inspect(reply, 'user account created correctly'
})
```

## Login

To login an existing account, pass an object with an `email`,  and a `password` fields set

```javascript
var Account = require('account-couch')
var config = require('nconf').defaults({
  couch: {
    host: 'localhost',
    port: 5984,
    database: 'account_couch_test'
  }    
})
var db = require('cradle-nconf')(config)
// create the account object with the cradle db passed as a parameter to the constructor
var account = new Account(db)
var data = {
  email: 'foo@example.com',
  password: 'barPassword',
}
account.login(data, function (err, reply) {
  if (err) {
    inspect(err, 'error performing login for user account')
    return
  }
  inspect(reply, 'user account created correctly'
})
```

## Serialize User

To serialize an existing user account profile, pass a profile object to the serializeUser method. You will get back the `_id` of the profile in the couchdb database

```javascript
var Account = require('account-couch')
var config = require('nconf').defaults({
  couch: {
    host: 'localhost',
    port: 5984,
    database: 'account_couch_test'
  }    
})
var db = require('cradle-nconf')(config)
// create the account object with the cradle db passed as a parameter to the constructor
var account = new Account(db)
var data = {
  email: 'foo@example.com',
  password: 'barPassword',
}
// get the profile by logging in
account.login(data, function (err, profile) {
  if (err) {
    inspect(err, 'error performing login for user account')
    return
  }
  inspect(profile, 'user account profile')
  account.serializeUser(profile, function (err, reply) {
    if (err) {
      inspect(err, 'error performing login for user account')
      return
    }
    inspect(reply, 'profile serialized to _id')
  })
})
```

## Deserialize User

To deserialize an existing user account profile, pass an `_id` of the profile in the couchdb database

```javascript
var Account = require('account-couch')
var config = require('nconf').defaults({
  couch: {
    host: 'localhost',
    port: 5984,
    database: 'account_couch_test'
  }    
})
var db = require('cradle-nconf')(config)
// create the account object with the cradle db passed as a parameter to the constructor
var account = new Account(db)
// an _id of a user profile in the couchdb database
var id = 'fooID'
account.deserializeUser(id, function (err, profile) {
  if (err) {
    inspect(err, 'error performing login for user account')
    return
  }
  inspect(profile, 'user account profile')
})
```



## Remove User

To completly remove an existing user account profile from the couchdb database, pass an object containing the `email` and `password` of the user account profile to be removed from the couchdb database

```javascript
var Account = require('account-couch')
var config = require('nconf').defaults({
  couch: {
    host: 'localhost',
    port: 5984,
    database: 'account_couch_test'
  }    
})
var db = require('cradle-nconf')(config)
// create the account object with the cradle db passed as a parameter to the constructor
var account = new Account(db)
var data = {
  email: 'foo@example.com',
  password: 'barPassword',
}
account.removeUser(data, function (err) {
  if (err) {
    inspect(err, 'error removing profile')
    return
  }
  inspect('user account profile removed')
})
```

# Test
To run the test suite execute

```bash
# install development dependencies
npm install
# run tests
npm test
```

