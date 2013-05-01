var forms = require('forms-bootstrap'),
    fields = forms.fields, validators = forms.validators
module.exports = function render_login_page(req, res) {
  var login_form = forms.create({
    email: fields.string({
      label: "Email",
      required: true,
      help_text: 'Enter your email address here'
    }),
    password: fields.password({
      label: "password",
      required: true,
      help_text: 'Case sensitive'
    })
  })

  var formHTML = login_form.toHTML()
  res.render('login', { title: 'Login', form: formHTML })
}
