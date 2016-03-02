var express = require('express');
var router = express.Router();
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var login_form = forms.create({
    fullName: fields.string({required: true}), // To be removed when have db-like objects
    email: fields.email({required: true}),
    password: fields.password({ required: validators.required('Can\'t get in without a password.') })
});

/* GET profile page. */
router.get('/', function(req, res, next) {
    var context = {};
    context.name = req.session.name;   // Get from objects
    // context.name = req.session.name = object.name  something like that
    context.email = req.session.email;
    context.password = req.session.password;    // Change/remove later
    res.render('profile', context);
});

router.post('/', function(req, res, next){
    var context = {};
    login_form.handle(req, {
        success: function (form) {
            req.session.name = form.data.fullName;
            req.session.email = form.data.email;
            req.session.password = form.data.password;
            context.name = req.session.name;
            context.email = req.session.email;
            context.password = req.session.password;
            res.render('profile', context);
        },
        error: function (form) {
            context.error = form.error; // Needs verification
            res.render('login', context);
        },
        empty: function (form) {
            context.error = "Empty form";
            res.render('login', context);
        }
    });
});

module.exports = router;
