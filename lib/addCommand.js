var inspect = require('eyespect').inspector();
var forms = require('forms-bootstrap'),
    fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

var config = require('nconf')
var getRepoNames = require('./getRepoNames')
var getJSON = require('./getJSON')
var performAddCommand = require('./performAddCommand')
module.exports = function (req, res) {
  var fleetConfig = config.get('fleet')
  var host = fleetConfig.host
  var port = fleetConfig.port
  var secret = fleetConfig.secret
  var hub = [host, port].join(':')
  var data = {
    host: host,
    port: port,
    secret: secret
  }

  getJSON(data, function (err, json) {
    if (err) {
      req.session.error = 'Error getting drone names, please try again later'
      return res.redirect('/ps')
    }
    var drones = Object.keys(json).sort(function (a, b) { return a.localeCompare(b) })
    drones.unshift('')
    getRepoNames(function (err, repoNames) {
      repoNames.unshift('')
      if (err) {
        req.session.error = 'Error getting repos, please try again later'
        return res.redirect('/ps')
      }
      var addForm = forms.create({
        repo: fields.array({
          label: "Repo",
          widget: widgets.select(),
          validators: [
            function (form, field, cb) {
              inspect(field,'field')
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
          validators: [
            function (form, field, cb) {
              if (field.value === '0') {
                return cb('You need to select a drone');
              }
              cb()
            }
          ],
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
      if (req.method.toLowerCase() !== 'post') {
        res.render('addCommand', {title: 'Add New Command', form: formHTML})
        return
      }

      addForm.handle(req, {
        error: function (form) {
          inspect('handling error')
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
          inspect(data, 'adding command')
          performAddCommand(data, function (err, reply) {
            if (!err) {
              req.session.success = 'Command added correctly'
              return res.redirect('/commands')
            }
            else {
              delete err.stack
              req.session.error = 'Error adding command: ' + err
              res.render('addCommand', {title: 'Add New Command', form: formHTML})
            }
          })
        }
      })
    })
  })
}
