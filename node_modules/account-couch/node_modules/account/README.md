# Account
Provide a skeleton interface for user account registration and login

[![Build Status](https://travis-ci.org/nisaacson/account.png?branch=master)](https://travis-ci.org/nisaacson/account)
[![Dependency Status Status](https://david-dm.org/nisaacson/account.png)](https://david-dm.org/nisaacson/account)


# Installation

```bash
npm install -S accounts
```

# Usage
The accounts module is an just an interface that is intended to be implemented by modules with specific backend code. See the [account-couch](https://github.com/nisaacson/account-couch) module for an example

All interfaces must implement all methods in index.js. These methods are as follows

* `login`
* `register`
* `serializeUser`
* `deserializeUser`
* `removeUser`

