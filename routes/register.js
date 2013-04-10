var inspect = require('eyespect').inspector({maxLength:10820})
var path = require('path')
// Models
var forms = require('forms-bootstrap'),
    fields = forms.fields, validators = forms.validators
var couchProfile = require('couch-profile')

function renderPage(req, res, form) {
  res.render('register', { title: 'register', form: form.toHTML() })
}

function confirmUniqueEmail(data, cb) {
  inspect('checking if email is unique')
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
      inspect(profile,'profile taken')
      logger.info('user tried to register email which is already taken', {
        type: 'web',
        email: data.email
      })
      return cb('Error, that email is already taken. Please select a different one')
    }
    inspect('email is unique')
    cb()
  })
}

module.exports = function(req, res) {
  var db = req.db
  var logger = req.logger
  var register_form = forms.create({
    email_field: fields.email({
      label: "Email",
      required: true,
      validators: [
        function (form, field, cb) {
          var email = field.data
          var findData = {
            email: email,
            db: db,
            logger: logger
          }
          confirmUniqueEmail(findData, cb)
        }
      ]
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
      handleSuccess(req, res, form)
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


function handleSuccess(req, res, form) {
  // make a new user
  var logger = req.logger
  var db = req.db
  var email = form.fields.email_field.data
  var password = form.fields.password_field.data
  var profileData = {
    email: email,
    password: password,
    db: db
  }
  couchProfile.getOrCreateProfile(profileData, function (err, profile) {
    inspect('done creating user')
    if (err) {
      logger.error('error during user registration', {
        type: 'web',
        error: err,
        stack: new Error().stack
      })
      req.session.error = 'An error occurred during registration, please try again later'
      return res.redirect('/register')
    }

    // set the customerIDs field on the user
    var id = profile._id
    var rev = profile._rev
    profile.customerIDs = []
    db.save(id, rev, profile, function (err, reply) {
      if (err) {
        logger.error('error during user registration', {
          type: 'web',
          error: err,
          stack: new Error().stack
        })
        req.session.error = 'An error occurred during registration, please try again later'
        return res.redirect('/register')
      }
      req.session.success = 'Your registration was sucessful. Please login now'
      res.redirect('/login')
      return
    })
  })
}
