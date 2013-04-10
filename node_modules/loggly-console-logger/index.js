var config = require('nconf')
var Loggly = require('winston-loggly').Loggly
var winston = require('winston');

var loggly = config.get('loggly')
// prepare some custom log levels
var customLevels = {
  levels: {
    debug: 0,
    info: 1,
    warning: 2,
    error: 3
  },
  colors: {
    debug: 'blue',
    info: 'green',
    warning: 'yellow',
    error: 'red'
  }
}

var handleExceptions = true
if (config.get('test')) {
  handleExceptions = false
}
var transports = [
  // setup console logging
  new (winston.transports.Console)({
    level: 'debug',
    levels: customLevels.levels,
    handleExceptions: handleExceptions,
    prettyPrint: true,
    colorize: true
  })
]


// setup logging to loggly
if (config.get('loggly')) {
  transports.push(new winston.transports.Loggly({
    subdomain: 'nisaacson',
    inputToken: loggly.inputToken,
    handleExceptions: handleExceptions,
    level: 'info',
    prettyPrint: true,
    json: true
    // colors: customLevels.colors
  }))
}

// create the logger
var logger = module.exports = new (winston.Logger)({
  level: 'debug',
  levels: customLevels.levels,
  handleExceptions: true,
  transports: transports,
  colors: customLevels.colors
})

// set the coloring
winston.addColors(customLevels.colors)

module.exports = logger
