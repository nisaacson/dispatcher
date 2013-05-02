var inspect = require('eyespect').inspector();
var path = require('path')
var forms = require('forms-bootstrap'),
    fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

var cloneRepo = require('dispatch-clone')
var logger = require('loggly-console-logger')
module.exports = function (req, res) {
  var addForm = forms.create({
    url: fields.string({
      label: "Repo URL",
      widget: widgets.text({
        classes: ['wideTextInput']
      }),
      required: true
    })
  })

  var formHTML = addForm.toHTML()
  if (req.method.toLowerCase() !== 'post') {
    res.render('addRepo', {title: 'Add New Repo', form: formHTML, query: ''})
    return
  }

  addForm.handle(req, {
    error: function (form) {
      inspect('form error')
      res.locals.error = 'Please correct the errors below'
      var formHTML = form.toHTML()
      res.render('addRepo', {title: 'Add New Repo', form: formHTML, query: ''})
    },
    success: function (form) {
      var urlField = form.fields.url
      var url = urlField.data
      var urlValue = urlField.value
      var formHTML = form.toHTML()
      var containerDir = path.join(__dirname, '../repos')
      var cloneData = {
        url: url,
        containerDir: containerDir
      }

      logger.info('start cloning new repo', {
        role: 'dispatch',
        section: 'addRepo',
        cloneData: cloneData
      })
      cloneRepo(cloneData, function (err, reply) {
        if (!err) {
          logger.info('clone new repo completed correctly', {
            role: 'dispatch',
            section: 'addRepo',
            cloneData: cloneData
          })
          req.session.success = 'Cloned repo correctly at url: ' + url
          return res.redirect('/repos')
        }
        else {
          logger.error('error cloning new repo', {
            role: 'dispatch',
            section: 'addRepo',
            cloneData: cloneData,
            error: err
          })
          req.session.error = 'Error cloning repo: ' + err
          res.render('addRepo', {title: 'Add New Repo', form: formHTML, query: ''})
        }
      })
    }
  })
}
