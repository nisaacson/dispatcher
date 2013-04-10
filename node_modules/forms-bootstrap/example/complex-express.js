/*jslint node: true */

/* 
 *  You need to install express & jade for this to work. 
 *
 *     $ npm install express jade
 */

var http = require('http'),
    forms = require('../lib/forms'),
    express = require('express'),
    app = module.exports = express.createServer();

var fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

app.configure(function () {
    app.set('views', __dirname);
    app.set('view engine', 'jade');

    app.use(express.bodyParser());
    app.use(app.router);
});

// Create a beautiful form
var tags = forms.widgets.text({
    placeholder: 'Comma separated list of tags',
});

var choices = { auto: 'auto', restaurant: 'restaurant', theatres: 'theatres' };

var form = forms.create({
    comment: fields.string({
        label: 'Your comment is',
        widget: widgets.textarea({rows: 6}),
        required: true
    }),
    tags: fields.string({
        label: 'Tag your comment',
        widget: tags,
        help_text: 'See http://en.wikipedia.org/wiki/Tag',
        required: true
    }),
    category: fields.array({
        label: 'Select appopriate category for this product',
        choices: choices,
        widget: widgets.select(),
        validators: [function (form, field, callback) {
          if (field.data === '0') {
            callback('You need to select a category');
          } else {
            callback();
          }
        }],
        required: true
    }),
    emotion: fields.array({
        label: 'Your emotion about the product is',
        choices: { neutral: 'Neutral', happy: 'Happy', unhappy: 'Unhappy' },
        widget: widgets.select(),
        required: true
    }),
    location: fields.string({
        label: 'Location (optional)'
    })
});

app.get('/', function (req, res) {
    res.render('complex', {
        locals: {
            title: 'Filling out the form...',
            form: form.toHTML()
        }
    });
});

app.post('/', function (req, res) {
    form.handle(req, {
        success: function (form) {
            res.render('page', {
                locals: {
                    title: 'Success!'
                }
            });
        },
        other: function (form) {
            res.render('complex', {
                locals: {
                    title: 'Failed!',
                    form: form.toHTML()
                }
            });
        }
    });
});

if (!module.parent) {
    app.listen(8000);
    console.log('Express server running at http://127.0.0.1:8000/');
}
