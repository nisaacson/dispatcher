var ce = require('cloneextend')
var mixin = require('simple-mixin')
var inspect = require('eyespect').inspector();
var AccountLogger = function (account, logger) {
  mixin(account, this)
  this.innerAccount = account
  this.logger = logger
}

AccountLogger.prototype.register = function (data, cb) {
  var logger = this.logger
  var logData = ce.clone(data)
  logData.password = '****'
  logger.info('begin registering new account', {
    data: logData,
    section: 'registerAccount'
  })
  return this.innerAccount.register(data, function (err, reply) {
    if (err) {
      logger.error('register account failed to complete correctly', {
        data: logData,
        error: err,
        section: 'registerAccount'
      })
    }
    else {
      logger.info('registered new account correctly', {
        data: logData,
        section: 'registerAccount'
      })

    }
    return cb(err, reply)
  })
}

AccountLogger.prototype.login = function (data, cb) {
  var logger = this.logger
  return this.innerAccount.login(data, function (err, reply) {
    var logData = ce.clone(data)
    logData.password = '****'
    if (err) {
      logger.error('error for login account', {
        data: logData,
        error: err,
        section: 'loginAccount'
      })
    }
    else if (!reply) {
      logger.info('login account failed to complete correctly', {
        data: logData,
        reply: reply,
        section: 'loginAccount'
      })
    }
    else {
      data.password = '****'
      var replyLogData = ce.clone(reply)
      replyLogData.hash = '****'
      logger.info('login account completed correctly', {
        data: logData,
        reply: replyLogData,
        section: 'loginAccount'
      })
    }
    return cb(err, reply)
  })
}

module.exports = AccountLogger
