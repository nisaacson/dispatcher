var inspect = require('eyespect').inspector();
var forms = require('forms-bootstrap'),
    fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

var cloneRepo = require('./cloneRepo')
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
      var formHTML = form.toHTML()
      res.render('addRepo', {title: 'Add New Repo', form: formHTML, query: ''})
    },
    success: function (form) {
      var urlField = form.fields.url
      var url = urlField.data
      var urlValue = urlField.value
      inspect(url,'url')
      inspect(urlValue,'urlValue')
      var formHTML = form.toHTML()
      cloneRepo(url, function (err, reply) {
        if (!err) {
          req.session.success = 'Cloned repo correctly at url: ' + url
          return res.redirect('/repos')
        }
        else {
          req.session.error = 'Error cloning repo: ' + err
          res.render('addRepo', {title: 'Add New Repo', form: formHTML, query: ''})
        }
      })
    }
  })
}
