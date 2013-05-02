# Required-Keys
Make sure the desired key value pairs exist in a given object

# Installation
`npm install -S required-keys`

# Usage

### Async
You must pass a callback where the error parameter will be null if there are no errors
**rk.truthy**
```javascript
var rk = require('required-keys');
var keys = ['foo', 'bar'];
var data = {
  foo: false,
  bar: 'test'
}
rk.truthy(data, keys, function(err) {
  console.log('error', err);
});
```


**rk.nonNull**
```javascript
var rk = require('required-keys');
var data = {
  foo: false,
  bar: 'test'
}
var keys = ['foo', 'bar'];
rk.nonNull(data, keys, function(err) {
  console.log('error should be null:', err);
});
```

**rk.keysOnly**
```javascript
var rk = require('required-keys');
var data = {
  foo: null,
  bar: undefined
}
var keys = ['foo', 'bar'];
rk.keysOnly(data, keys, function(err) {
  console.log('error should be null:', err);
});
```


### Sync
All sync methods return null if all checks pass or an array of errors

**rk.truthySync**

```javascript
var keys = ['dog', 'cat', 'lemon']
var data = {
  dog: 'dog',
  cat: 'cat',
  lemon: true,
  apple: ''
}
// err is either null if all keys map to truthy values or an array of errors
var err = rk.truthySync(data, keys)
```

**rk.nonNullSync**

```javascript
var keys = ['dog', 'cat', 'lemon']
var data = {
  dog: 'dog',
  cat: 'cat',
  lemon: false
}
// err is either null if all keys map to truthy values or an array of errors
var err = rk.nonNullSync(data, keys)
should.not.exist(err);
```

**rk.keysOnlySync**

```javascript
var keys = ['dog', 'cat', 'lemon']
var data = {
  dog: null,
  cat: undefined,
  fruit: 'banana'
}
// err is either null if all keys map to truthy values or an array of errors
var err = rk.keysOnlySync(data, keys)
```


