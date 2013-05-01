var inspect = require('eyespect').inspector();
var path = require('path')
var renderLoginPage = require('./renderLoginPage')
// Models
var forms = require('forms-bootstrap'),
    fields = forms.fields, validators = forms.validators
var couchProfile = require('couch-profile')
function renderPage(req, res, form) {
  res.render('register', { title: 'register', form: form.toHTML() })
}

function confirmUniqueEmail(data, cb) {
  var logger = data.logger
  var findData = {
    email: data.email,
    db: data.db
  }
  couchProfile.findProfile(findData, function (err, profile) {
    var error
    if (err) {
      logger.error('error during registration checking if email is unique', {
        type: 'web',
        error: err,
        stack: new Error().stack
      });
      error = 'An error occurred during your registration, please try again later'
      return cb(error)
    }
    if (profile) {
      logger.info('user tried to register email which is already taken', {
        type: 'web',
        email: data.email
      })
      return cb('Error, that email is already taken. Please select a different one')
    }
    cb()
  })
}

module.exports = function(account) {
  return function(req, res) {
    var register_form = forms.create({
      email_field: fields.email({
        label: "Email",
        required: true,
        validators: []
      }),
      password_field: fields.password({
        label: "Password",
        required: true,
        help_text: 'Case sensitive, must be at least 5 characters long',
        block_help_text: 'Case sensitive, must be at least 5 characters long',
        validators: [validators.minlength(5)]
      }),
      password_confirm_field: fields.password({
        label: "Confirm Password",
        required: true,
        validators: [validators.matchField('password_field')]
      })
    })

    var method = req.method;
    if (method.toUpperCase() !== 'POST') {
      return renderPage(req, res, register_form)
    }
    register_form.handle(req, {
      success: function (form) {
        handleSuccess(req, res, form, account)
      },
      other: function (form) {
        console.log('form other called')
        renderPage(form, req, res)
      },
      error: function(form) {
        req.session.error = 'Please correct the errors below'
        form.fields.password_field.data = ''
        form.fields.password_field.value = ''
        form.fields.password_confirm_field.data = ''
        form.fields.password_confirm_field.value = ''
        renderPage(form, req, res)
      }
    })
  }
}


function handleSuccess(req, res, form, account) {
  // make a new user
  var logger = req.logger
  var db = req.db
  var email = form.fields.email_field.data
  var password = form.fields.password_field.data
  var profileData = {
    email: email,
    password: password
  }
  account.register(profileData, function (err, profile) {
    if (err) {
      logger.error('error during user registration', {
        role: 'dispatch',
        error: err,
        stack: new Error().stack
      })
      req.session.error = 'An error occurred during registration, please try again later'
      return res.redirect('/register')
    }
    res.locals.success = 'Your registration was sucessful. Please login now'
    return renderLoginPage(req, res)
  })
}
