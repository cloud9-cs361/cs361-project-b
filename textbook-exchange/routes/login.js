var express = require('express');
var router = express.Router();

function validateLogin(name, email, password) {
  var errors = [];
  // name validation
  if (name == undefined || name.length == 0) {
    errors.push('Name is required.');
  }
  // email validation
  if (email == undefined || email.length == 0 || !(email.includes('@') && email.includes('.'))) {
    errors.push('Valid email address is required.');
  }
  // ***********need validation to check if account exists for email
  // password validation
  if (password == undefined || password.length == 0) {
    errors.push('Valid password is required.');
  }
  // ***********need validation to check if password is valid for account
  return errors;
}

router.get('/', function(req, res, next){
    res.render('login');
});

router.post('/', function(req, res) {
  console.log(req.body);
  var errors = validateLogin(req.body.name, req.body.email, req.body.password);
  if (errors.length == 0) {
    // Add name and email to session
    req.session.name = req.body.name;
    req.session.email = req.body.email;
    res.redirect('/profile');
  }
  else {
    res.render('login', {errors: errors});
  }
});

module.exports = router;

module.exports.validateLogin = validateLogin;