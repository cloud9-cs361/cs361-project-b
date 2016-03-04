var express = require('express');
var router = express.Router();



function validateAccountCreation(name, username, password, password2, zip) {
  var errors = [];
  if (name == undefined || name.length == 0) {
    errors.push('Name is required.');
  }
  if (!(username.includes('@') && username.includes('.'))) {
    errors.push('Valid email address is required for username.')
  }
  return errors;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('createAccount');
});

router.post('/', function(req, res) {
  console.log(req.body);
  var errors = validateAccountCreation(req.body.name, req.body.username, req.body.password, req.body.password2, req.body.zip);
  if (errors.length == 0) {
    // write account info to database
    res.redirect('/profile');
  }
  else {
    res.render('createAccount', {errors: errors});
  }
});

module.exports = router;

module.exports.validateAccountCreation = validateAccountCreation;