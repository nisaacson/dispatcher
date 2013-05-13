var forms = require('forms-bootstrap'),
    fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

var config = require('nconf')
var db = require('cradle-nconf')(config)
var logger = require('loggly-console-logger')
var getRepoNames = require('../lib/getRepoNames')
var getPS = require('fleet-get-ps')
var performAdd = require('dispatch-add-command')
module.exports = function (req, res) {
  var fleetConfig = config.get('fleet')
  var host = fleetConfig.host
  var port = fleetConfig.port
  var secret = fleetConfig.secret
  var data = {
    host: host,
    port: port,
    secret: secret
  }
  getPS(data, function (err, json) {
    if (err) {
      logger.error('error adding new command, failed to get drone names from fleet ps json', {
        role: 'dispatch',
        addData: data,
        error: err,
        section: 'addCommand'
      })
      req.session.error = 'Error getting drone names, please try again later'
      return res.redirect('/repos')
    }
    var drones = Object.keys(json).sort(function (a, b) { return a.localeCompare(b) })
    drones.unshift('')
    getRepoNames(function (err, repoNames) {
      repoNames.unshift('')
      if (err) {
        logger.error('error adding new command, failed to get list of repo names', {
          role: 'dispatch',
          addData: data,
          error: err,
          section: 'addCommand'
        })
        req.session.error = 'Error getting repos, please try again later'
        return res.redirect('/ps')
      }
      var addForm = forms.create({
        repo: fields.array({
          label: "Repo",
          widget: widgets.select(),
          validators: [
            function (form, field, cb) {
              if (field.value === '0') {
                return cb('You need to select a repo');
              }
              cb()
            }
          ],
          choices: repoNames,
          required: true
        }),
        drone: fields.array({
          label: "Drone",
          widget: widgets.select(),
          choices: drones,
          help_text: 'leave blank to spawn on any random drone',
          required: true
        }),

        command: fields.string({
          label: "Command",
          widget: widgets.text({
            classes: ['wideTextInput']
          }),
          required: true
        }),
        instances: fields.number({
          label: "Instances",
          widget: widgets.text(),
          validators: [
            function (form, field, cb) {
              if (field.data === '0') {
                return cb('You need to select a drone');
              }
              cb()
            }
          ],
          help_text: 'How many instances should run in parallel? Digits 0-9 only',
          choices: repoNames,
          required: true
        })
      })

      var formHTML = addForm.toHTML()
      var method = req.method.toLowerCase()
      if (method !== 'post') {
        res.render('addCommand', {title: 'Add New Command', form: formHTML})
        return
      }
      addForm.handle(req, {
        error: function (form) {
          var formHTML = form.toHTML()
          res.render('addCommand', {title: 'Add New Command', form: formHTML})
        },
        success: function (form) {
          var repoField = form.fields.repo
          var repo = repoField.choices[parseInt(repoField.value)]
          var droneField = form.fields.drone
          var drone = droneField.choices[parseInt(droneField.value)]
          var urlField = form.fields.url
          var command = form.fields.command.data
          var instances = form.fields.instances.data

          var data = {
            repo: repo,
            command: command,
            instances: instances,
            drone: drone
          }
          logger.info('adding new command', {
            role: 'dispatch',
            addData: data,
            section: 'addCommand'
          })
          data.db = db
          performAdd(data, function (err, reply) {
            if (err) {
              delete err.stack
              req.session.error = 'Error adding command: ' + err
              logger.error('add new command failed', {
                role: 'dispatch',
                addData: data,
                error: err,
                section: 'addCommand'
              })
              res.locals.error = 'Please correct the errors below'
              res.render('addCommand', {title: 'Add New Command', form: formHTML})
              return res.redirect('/commands')
            }
            delete data.db
            logger.info('add new command completed correctly', {
              role: 'dispatch',
              addData: data,
              section: 'addCommand'
            })
            req.session.success = 'Command added correctly'
            return res.redirect('/commands')

          })
        }
      })
    })
  })
}
