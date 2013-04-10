var inspect = require('eyespect').inspector();
var forms = require('forms-bootstrap'),
    fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

var getRepoNames = require('./getRepoNames')
var performAddCommand = require('./performAddCommand')
module.exports = function (req, res) {
  getRepoNames(function (err, repoNames) {
    if (err) {
      req.session.error = 'Error getting repos, please try again later'
      return res.redirect('/ps')
    }
    var addForm = forms.create({
      repo: fields.array({
        label: "Repo",
        widget: widgets.select(),
        choices: repoNames,
        required: true
      }),
      command: fields.string({
        label: "Command",
        widget: widgets.text(),
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
        var formHTML = form.toHTML()
        res.render('addCommand', {title: 'Add New Command', form: formHTML})
      },
      success: function (form) {
        var urlField = form.fields.url
        var url = urlField.data
        var urlValue = urlField.value
        inspect(url,'url')
        inspect(urlValue,'urlValue')
        var formHTML = form.toHTML()
        performAddCommand(url, function (err, reply) {
          if (!err) {
            req.session.success = 'Command added correctly'
            return res.redirect('/repos')
          }
          else {
            req.session.error = 'Error adding command'
            res.render('addCommand', {title: 'Add New Command', form: formHTML, query: ''})
          }
        })
      }
    })
  })
}
