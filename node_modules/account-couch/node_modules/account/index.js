module.exports = {
  login: function(data, cb) {
    return cb({
      message: 'login failed',
      error: 'not implemented',
      stack: new Error().stack
    })
  },
  register: function(data, cb) {
    return cb({
      message: 'register failed',
      error: 'not implemented',
      stack: new Error().stack
    })
  },
  deserializeUser: function(data, cb) {
    return cb({
      message: 'deserializeUser failed',
      error: 'not implemented',
      stack: new Error().stack
    })
  },
  serializeUser: function(data, cb) {
    return cb({
      message: 'serializeUser failed',
      error: 'not implemented',
      stack: new Error().stack
    })
  },
  removeUser: function(data, cb) {
    return cb({
      message: 'removeUser failed',
      error: 'not implemented',
      stack: new Error().stack
    })
  }
}
