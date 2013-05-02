var async = require('async')
var fs = require('fs')
var path = require('fs')
var inspect = require('eyespect').inspector();
var getRepoNames = require('../lib/getRepoNames')
var config = require('nconf')
var logger = require('loggly-console-logger')
module.exports = function (req, res) {
  getRepoNames(function (err, reply) {
    var repos = reply.sort(function (a, b) {
      return a.localeCompare(b)
    })
    if (err) {
      logger.error('failed to load repos page', {
        error: err,
        section: 'repos',
        role: 'dispatch'
      })
      req.session.error = 'Error getting repos, please try again later'
      return res.redirect('/ps')
    }
    res.render('repos', {title: 'Repos', repos: repos})
  })
}
