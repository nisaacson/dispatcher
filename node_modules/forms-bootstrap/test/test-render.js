var forms = require('../lib/forms');


var testWrap = function(tag){
    exports[tag] = function(test){
        var f = forms.create({fieldname: forms.fields.string()});
        test.equals(
            f.toHTML(forms.render[tag]),
            '<' + tag + ' class="field">' +
                '<label for="id_fieldname">Fieldname</label>' +
                '<input type="text" name="fieldname" id="id_fieldname" />' +
            '</' + tag + '>'
        );
        test.done();
    };

    exports[tag + ' required'] = function(test){
        var f = forms.create({
            fieldname: forms.fields.string({required:true})
        });
        test.equals(
            f.toHTML(forms.render[tag]),
            '<' + tag + ' class="field required">' +
                '<label for="id_fieldname">Fieldname</label>' +
                '<input type="text" name="fieldname" id="id_fieldname" />' +
            '</' + tag + '>'
        );
        test.done();
    };

    exports[tag + ' bound'] = function(test){
        test.expect(1);
        var f = forms.create({name: forms.fields.string()});
        f.bind({name: 'val'}).validate(function(err, f){
            test.equals(
                f.toHTML(forms.render[tag]),
                '<' + tag + ' class="field">' +
                    '<label for="id_name">Name</label>' +
                    '<input type="text" name="name" id="id_name" value="val" />' +
                '</' + tag + '>'
            );
        });
        setTimeout(test.done, 25);
    };

    exports[tag + ' bound error'] = function(test){
        test.expect(1);
        var f = forms.create({
            field_name: forms.fields.string({
                validators: [function(form, field, callback){
                    callback('validation error');
                }]
            })
        });
        f.bind({field_name: 'val'}).validate(function(err, f){
            test.equals(
                f.toHTML(forms.render[tag]),
                  '<' + tag + ' class="field error">'
                +   '<span class="help-inline">validation error</span>'
                +   '<label for="id_field_name">Field name</label>'
                +   '<input type="text" name="field_name" id="id_field_name" value="val" />'
                + '</' + tag + '>'
            );
        });
        setTimeout(test.done, 25);
    };

    exports[tag + ' multipleCheckbox'] = function(test){
        var f = forms.create({
            fieldname: forms.fields.string({
                choices: {one: 'item one'},
                widget: forms.widgets.multipleCheckbox()
            })
        });
        test.equals(
            f.toHTML(forms.render[tag]),
            '<' + tag + ' class="field">' +
                '<fieldset>' +
                    '<legend>Fieldname</legend>' +
                    '<input type="checkbox" name="fieldname" id="id_fieldname_one"'+
                    ' value="one">' +
                    '<label for="id_fieldname_one">item one</label>' +
                '</fieldset>' +
            '</' + tag + '>'
        );
        test.done();
    };

    exports[tag + ' multipleRadio'] = function(test){
        var f = forms.create({
            fieldname: forms.fields.string({
                choices: {one: 'item one'},
                widget: forms.widgets.multipleRadio()
            })
        });
        test.equals(
            f.toHTML(forms.render[tag]),
            '<' + tag + ' class="field">' +
                '<fieldset>' +
                    '<legend>Fieldname</legend>' +
                    '<input type="radio" name="fieldname" id="id_fieldname_one"'+
                    ' value="one">' +
                    '<label for="id_fieldname_one">item one</label>' +
                '</fieldset>' +
            '</' + tag + '>'
        );
        test.done();
    };

    exports[tag + ' label custom id'] = function(test){
        var f = forms.create({
            fieldname: forms.fields.string({
                id: 'custom-id'
            })
        });
        test.equals(
            f.toHTML(forms.render[tag]),
            '<' + tag + ' class="field">' +
                '<label for="custom-id">Fieldname</label>' +
                '<input type="text" name="fieldname" id="custom-id" />' +
            '</' + tag + '>'
        );
        test.done();
    };

    exports[tag + ' hidden label'] = function(test){
        var f = forms.create({
            fieldname: forms.fields.string({
                widget: forms.widgets.hidden()
            })
        });
        test.equals(
            f.toHTML(forms.render[tag]),
            '<' + tag + ' class="field">' +
                '<input type="hidden" name="fieldname" id="id_fieldname" />' +
            '</' + tag + '>'
        );
        test.done();
    };
};

testWrap('div');
testWrap('p');
testWrap('li');

exports['table'] = function(test){
    var f = forms.create({fieldname: forms.fields.string()});
    test.equals(
        f.toHTML(forms.render.table),
        '<tr class="field">' +
            '<th><label for="id_fieldname">Fieldname</label></th>' +
            '<td>' +
                '<input type="text" name="fieldname" id="id_fieldname" />' +
            '</td>' +
        '</tr>'
    );
    test.done();
};

exports['table required'] = function(test){
    var f = forms.create({
        fieldname: forms.fields.string({required:true})
    });
    test.equals(
        f.toHTML(forms.render.table),
        '<tr class="field required">' +
            '<th><label for="id_fieldname">Fieldname</label></th>' +
            '<td>' +
                '<input type="text" name="fieldname" id="id_fieldname" />' +
            '</td>' +
        '</tr>'
    );
    test.done();
};

exports['table bound'] = function(test){
    test.expect(1);
    var f = forms.create({name: forms.fields.string()});
    f.bind({name: 'val'}).validate(function(err, f){
        test.equals(
            f.toHTML(forms.render.table),
            '<tr class="field">' +
                '<th><label for="id_name">Name</label></th>' +
                '<td>' +
                    '<input type="text" name="name" id="id_name"' +
                    ' value="val" />' +
                '</td>' +
            '</tr>'
        );
    });
    setTimeout(test.done, 25);
};

exports['table bound error'] = function(test){
    test.expect(1);
    var f = forms.create({
        field_name: forms.fields.string({
            validators: [function(form, field, callback){
                callback('validation error');
            }]
        })
    });
    f.bind({field_name: 'val'}).validate(function(err, f){
        test.equals(
            f.toHTML(forms.render.table),
            '<tr class="field error">' +
                '<th><label for="id_field_name">Field name</label></th>' +
                '<td>' +
                    '<input type="text" name="field_name"' +
                    ' id="id_field_name" value="val" />' +
                    '<span class="help-inline">validation error</span>' +
                '</td>' +
            '</tr>'
        );
    });
    setTimeout(test.done, 25);
};


exports['string json render'] = function(test){
    test.expect(1);
    var f = forms.create({name: forms.fields.string()});
    f.bind({name: 'Mariusz'}).validate(function(err, f){
        test.equals(
            f.toJSON(forms.render.json).name.value,
            'Mariusz'
        );
    });
    setTimeout(test.done, 25);
};

exports['url json render'] = function(test){
    test.expect(3);
    var f = forms.create({email: forms.fields.url({placeholder: "Please put url here"})});
    f.bind({email: 'bad url'}).validate(function(err, f){
        result = f.toJSON(forms.render.json);
        test.equals(result.email.value, 'bad url');
        test.equals(result.email.error, 'Please enter a valid URL.');
        test.equals(result.email.placeholder, 'Please put url here');
    });
    setTimeout(test.done, 25);
};

exports['email json render'] = function(test){
    test.expect(3);
    var f = forms.create({email: forms.fields.email()});
    f.bind({email: 'mariusz'}).validate(function(err, f){
        result = f.toJSON(forms.render.json);
        test.equals(result.email.value, 'mariusz');
        test.equals(result.email.error, 'Please enter a valid email address.');
        test.equals(result.email.name, 'email');
    });
    setTimeout(test.done, 25);
};

