
# Forms

Constructing forms by hand is a lot of work. Popular frameworks like
Ruby on Rails and Django contain code to make this process easier.
This module is an attempt to provide the same sort of helpers for node.js 
and express, with the default bootstrap twitter rendering.


# How to install

    npm install forms-bootstrap


## Example

Creating an example registration form (in CoffeeScript):

    forms = require 'forms-bootstrap'

    myform = forms.create
        name: forms.fields.string
            required: true
            widget: forms.widgets.text
                placeholder: 'Your full name'
                classes: ['span5']
        address: forms.fields.string
            widget: forms.widgets.textarea
                rows: 3
        website: forms.fields.url()
        email: forms.fields.email()


Handling a request:

    app.post '/user/register', (req, res) ->
        myform.handle req.body,
            success: (form) ->
                # do something with the data
                console.log form.data.name
            error: (form) ->
                # handle the error, by re-rendering the form again
                res.render 'user/register', form: form.toHTML()


And this is how your user/register.jade template might look like:

    // Your initial stuff, headers and all go here
    .container
        .row
            .span10
                h2 New user registration
                form(action='/user/register', method='POST').form-horizontal.well
                    != form
                    #submit
                    input(type='submit', value='Create').btn.btn-large


That's it. For more details and working examples look in the example folder.

In examples folder, run:
 * node simple-express.js
   This one uses layout.jade and page.jade to render a simple form.
 * node complex-express.js
   This one uses complex.jade template and showcases a more complex form.



## Form passed as JSON (instead of HTML)

Sometimes getting the form as HTML from the server is not appropriate. 
There is now support for rendering the form fields as JSON instead of HTML.
This allows easier integration with custom formatting on the client, and supports non-browser clients, too.

For the above form example, the generated JSON would look like this:

  {
    name: {id: 'id_name', help: '', value: ''},
    address: {id: 'id_address', help: '', value: ''},
    website: {id: 'id_website', help: '', value: ''},
    email: {id: 'id_email', help: '', value: ''}
  }
 
Fields, that are filled in when the data is available:

    id:             # id of the element, always present
    value:          # the element value, always present
    help:           # help text, always

    required        # is this field required?
    placeholder:    # the placeholder value
    label:          # label value
    error:          # the error text if validation failed





# Status and todo list

Status: development/experimental (do not use in production)
Tests: all tests pass


Todo: 
 * currently only horizontal form layout renders nicely, need to fix for vertical forms
 * tests may not cover all the use cases
 * integrate jquery and client-side form validation capabilities


# Contribute

This module has been derived from two other modules,
and all credits go to original project owners and contributors:

 * original work by coalan, https://github.com/caolan/forms
 * bootstrap extension by caulagi, https://github.com/caulagi/forms

Please contribute to the original projects with generic patches.
For bootstrap-specific extensions or features feel free to fork us. 
Your pull-requests warmly welcomed. 



# Details


## Available types

A list of the fields, widgets, validators and renderers available as part of
the forms module. Each of these components can be switched with customised
components following the same API.

### Fields

* string
* number
* boolean
* array
* password
* email
* url

### Widgets

* text
* password
* hidden
* checkbox
* select
* textarea
* multipleCheckbox
* multipleRadio
* multipleSelect

### Validators

* matchField
* min
* max
* range
* minLength
* maxLength
* rangeLength
* regexp
* email
* url

### Renderers

* div
* p
* li
* table


## API

A more detailed look at the methods and attributes available. Most of these
you will not need to use directly.

### forms.create(fields)

Converts a form definition (an object literal containing field objects) into a
form object.




### Form object

#### Attributes

* fields - Object literal containing the field objects passed to the create
  function

#### form.handle(req, callbacks)
Inspects a request or object literal and binds any data to the correct fields.

#### form.bind(data)
Binds data to correct fields, returning a new bound form object.

#### form.toHTML(iterator)
Runs toHTML on each field returning the result. If an iterator is specified,
it is called for each field with the field name and object as its arguments,
the iterator's results are concatenated to create the HTML output, allowing
for highly customised markup.

### form.clear()
For all fields in the form, it will set error property to undefined and value property to ''. 


### Bound Form object

Contains the same methods as the unbound form, plus:

#### Attributes

* data - Object containing all the parsed data keyed by field name
* fields - Object literal containing the field objects passed to the create
  function

#### form.validate(callback)
Calls validate on each field in the bound form and returns the resulting form
object to the callback.

#### form.isValid()
Checks all fields for an error attribute. Returns false if any exist, otherwise
returns true.

#### form.toHTML(iterator)
Runs toHTML on each field returning the result. If an iterator is specified,
it is called for each field with the field name and object as its arguments,
the iterator's results are concatenated to create the HTML output, allowing
for highly customised markup.


### Field object

#### Attributes

* label - Optional label text which overrides the default
* required - Boolean describing whether the field is mandatory
* validators - An array of functions which validate the field data
* widget - A widget object to use when rendering the field
* id - An optional id to override the default
* choices - A list of options, used for multiple choice fields


### field.clear()

Sets error property to undefined and value property to ''. 


#### field.parse(rawdata)

Coerces the raw data from the request into the correct format for the field,
returning the result, e.g. '123' becomes 123 for the number field.

#### field.bind(rawdata)

Returns a new bound field object. Calls parse on the data and stores in the
bound field's data attribute, stores the raw value in the value attribute.

#### field.errorHTML()

Returns a string containing a HTML element containing the fields error
message, or an empty string if there is no error associated with the field.

#### field.labelText(name)

Returns a string containing the label text from field.label, or defaults to
using the field name with underscores replaced with spaces and the first
letter capitalised.

#### field.labelHTML(name, id)

Returns a string containing a label element with the correct 'for' attribute
containing the text from field.labelText(name).

#### field.classes()

Returns an array of default CSS classes considering the field's attributes,
e.g. ['field', 'required', 'error'] for a required field with an error message.

#### field.toHTML(name, iterator)

Calls the iterator with the name and field object as arguments. Defaults to
using forms.render.div as the iterator, which returns a HTML representation of
the field label, error message and widget wrapped in a div.

### Bound Field object

_same as field object, but with a few extensions_

#### Attributes

* value - The raw value from the request data
* data - The request data coerced to the correct format for this field
* error - An error message if the field fails validation

#### validate(callback)

Checks if the field is required and whether it is empty. Then runs the
validator functions in order until one fails or they all pass. If a validator
fails, the resulting message is stored in the field's error attribute.


### Widget object

#### Attributes

* classes - Custom classes to add to the rendered widget
* type - A string representing the widget type, e.g. 'text' or 'checkbox'

#### toHTML(name, field)

Returns a string containing a HTML representation of the widget for the given
field.


### Validator

A function that accepts a bound form, bound field and a callback as arguments.
It should apply a test to the field to assert its validity. Once processing
has completed it must call the callback with no arguments if the field is
valid or with an error message if the field is invalid.


### Renderer

A function which accepts a name and field as arguments and returns a string
containing a HTML representation of the field.

