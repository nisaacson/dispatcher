var forms = require('forms-bootstrap'),
    fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

module.exports = function (req, res) {
  var form = buildForm(req.body)
  var formHTML = form.toHTML()
  res.render('hub', { title: 'Fleet Hub', form: formHTML})
}

function buildForm(body) {
  var form = forms.create({
    host: fields.string({
      label: "Host",
      widget: widgets.text({
        classes: ['typeahead']
      }),
      help_text: 'Fleet host address like localhost or 127.0.0.1 or git.example.com',
      required: true
    }),
    port: fields.string({
      label: "Port",
      widget: widgets.text(),
      validators: [function (form, field, callback) {
        if (field.data === '0') {
          callback('You need to specify a port');
        } else {
          callback();
        }
      }],
      required: true
    }),
    secret: fields.string({
      label: "Secret",
      widget: widgets.text(),
      validators: [function (form, field, callback) {
        if (field.data === '0') {
          callback('You need to specify a secret');
        } else {
          callback();
        }
      }],
      required: true
    })
  })
  form.fields.host.data = body.host
  form.fields.host.value = body.host

  form.fields.port.data = body.port
  form.fields.port.value = body.port

  form.fields.secret.data = body.secret
  form.fields.secret.value = body.secret
  return form
}
