/*jslint node: true */

var forms = require('./forms'),
    async = require('async');


exports.string = function (opt) {
    opt = opt || {};

    var k, f = {};

    for (k in opt) {
        if (opt.hasOwnProperty(k)) {
            f[k] = opt[k];
        }
    }
    f.widget = f.widget || forms.widgets.text();

    f.parse = function (raw_data) {
        if (typeof raw_data !== 'undefined' && raw_data !== null) {
            return String(raw_data);
        }
        return '';
    };
    f.bind = function (raw_data) {
        var k, b = {};
        // clone field object:
        for (k in f) {
            if (f.hasOwnProperty(k)) {
                b[k] = f[k];
            }
        }
        b.value = raw_data;
        b.data = b.parse(raw_data);
        b.validate = function (form, callback) {
            if (raw_data === '' || raw_data === null || typeof raw_data === 'undefined') {
                // don't validate empty fields, but check if required
                if (b.required) { b.error = opt.emptyMessage || 'This field is required.'; }
                process.nextTick(function () { callback(null, b); });
            } else {
                async.forEachSeries(b.validators || [], function (v, callback) {
                    if (!b.error) {
                        v(form, b, function (v_err) {
                            b.error = v_err ? v_err.toString() : null;
                            callback(null);
                        });
                    } else {
                        callback(null);
                    }
                }, function (err) {
                    callback(err, b);
                });
            }
        };
        return b;
    };
    f.clear = function() {
        this.value = '';
        this.error = undefined;
        return this;
    };
    f.errorHTML = function () {
        return this.error ? '<span class="help-inline">' + this.error + '</span>' : '';
    };
    f.labelText = function (name) {
        return this.label || name[0].toUpperCase() + name.substr(1).replace('_', ' ');
    };
    f.labelHTML = function (name, id) {
        if (this.widget.type === 'hidden') { return ''; }
        return '<label for="' + (id || 'id_' + name) + '">' + this.labelText(name, id) + '</label>';
    };
    f.classes = function () {
        var r = ['field'];
        if (this.error) { r.push('error'); }
        if (this.required) { r.push('required'); }
        return r;
    };
    f.toHTML = function (name, iterator) {
        return (iterator || forms.render.control)(name, this);
    };
    f.toJSON = function (name) {
        return forms.render.json(name, this);
    };

    return f;
};


exports.number = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);

    f.parse = function (raw_data) {
        if (raw_data === null || raw_data === '') {
            return NaN;
        }
        return Number(raw_data);
    };
    return f;
};

exports.boolean = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);

    f.widget = opt.widget || forms.widgets.checkbox();
    f.parse = function (raw_data) {
        return Boolean(raw_data);
    };
    return f;
};

exports.email = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    if (f.validators) {
        f.validators.unshift(forms.validators.email(opt.invalidMessage));
    } else {
        f.validators = [forms.validators.email(opt.invalidMessage)];
    }
    return f;
};

exports.phone = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    if (f.validators) {
        f.validators.unshift(forms.validators.phone(opt.invalidMessage));
    } else {
        f.validators = [forms.validators.phone(opt.invalidMessage)];
    }
    return f;
};

exports.password = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    f.widget = opt.widget || forms.widgets.password();
    return f;
};

exports.url = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    if (f.validators) {
        f.validators.unshift(forms.validators.url(opt.invalidMessage));
    } else {
        f.validators = [forms.validators.url(opt.invalidMessage)];
    }
    return f;
};

exports.array = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    f.parse = function (raw_data) {
        if (typeof raw_data === 'undefined') { return []; }
        return Array.isArray(raw_data) ? raw_data : [raw_data];
    };
    return f;
};

