var forms = require('../lib/forms');


exports['create'] = function(test){
    var f = forms.create({
        field1: forms.fields.string(),
        field2: forms.fields.string()
    });
    test.equals(
        f.toHTML(),
         '<div class="control-group">'
        +  '<label class="control-label" for="id_field1">Field1</label>'
        +  '<div class="controls">'
        +     '<input type="text" name="field1" id="id_field1" />'
        +  '</div>'
        + '</div>'
        + '<div class="control-group">'
        +   '<label class="control-label" for="id_field2">Field2</label>'
        +   '<div class="controls">'
        +     '<input type="text" name="field2" id="id_field2" />'
        +   '</div>'
        + '</div>'
    );
    test.done();
};
