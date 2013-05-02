/*jslint node: true */

var wrapWith = function (tag) {
    return function (name, field) {
        var html = ['<' + tag + ' class="' + field.classes().join(' ') + '">'];
        if (field.widget.type === 'multipleCheckbox' || field.widget.type === 'multipleRadio') {
            html = html.concat([
                '<fieldset>',
                '<legend>', field.labelText(name), '</legend>',
                field.widget.toHTML(name, field),
                field.errorHTML(),
                '</fieldset>'
            ]);
        } else {
            html.push(field.errorHTML() + field.labelHTML(name, field.id) + field.widget.toHTML(name, field));
        }
        return html.join('') + '</' + tag + '>';
    };
};
exports.div = wrapWith('div');
exports.p = wrapWith('p');
exports.li = wrapWith('li');

exports.table = function (name, field) {
    return [
        '<tr class="', field.classes().join(' '), '">',
        '<th>', field.labelHTML(name), '</th>',
        '<td>',
        field.widget.toHTML(name, field),
        field.errorHTML(),
        '</td>',
        '</tr>'
    ].join('');
};



// Bootstrap specific - Renders the field as necessary in form-horizontal
// See - http://twitter.github.com/bootstrap/base-css.html#forms
exports.control = function (name, field) {
    var l_id = field.id || 'id_' + name,
        klass = 'control-group',
        help = field.help_text ? '<span class="help-inline">' + field.help_text + '</span>' : '';

    if (field.error) {
        klass += ' error';
    }

    var html = [
        '<div class="' + klass + '">',
        '<label class="control-label" for="' + l_id + '">' + field.labelText(name) + '</label>',
        '<div class="controls">',
        field.widget.toHTML(name, field),
        help,
        field.errorHTML(),
        '</div>',
        '</div>'
    ].join('');
    return html
};

// Simple vanilla renderer that converts the form into a JSON structure
exports.json = function (name, field) {
    var e = {};
    e.help = field.help_text ? field.help_text : '';
    e.value = field.value ? field.value : '';
    e.label = field.labelText(name);
    e.name = name;
    if (field.error) { e.error = field.error; }
    if (field.required) { e.required = field.required; }
    if (field.placeholder) { e.placeholder = field.placeholder; }
    if (field.id) {
        e.id = field.id;
    } else {
        e.id = 'id_' + name;
    }

    return e;
};
