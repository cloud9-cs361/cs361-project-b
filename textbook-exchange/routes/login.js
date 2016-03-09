var express = require('express');
var router = express.Router();
var assert = require('assert');

router.get('/', function(req, res, next){
    res.render('login');
});

router.post('/', function(req, res) {
  var errors = validateLogin(req.body.email, req.body.password);
  validateAgainstDB(req.body.email, req.body.password, req.app.db.get('users'), function (dbErrors, user) {
    errors = errors.concat(dbErrors);
    if (errors.length == 0) {
      // Add name and email to session
      req.session.name = user.name;
      req.session.zip = user.zip;
      req.session.email = user.email;
      res.redirect('/profile');
    }
    else {
      res.render('login', {errors: errors});
    }
  });
});

function validateLogin(email, password) {
  var errors = [];
  // email validation
  if (email == undefined || email.length == 0 || !(email.indexOf('@') > -1 && email.indexOf('.') > -1)) {
    errors.push('Valid email address is required.');
  }
  // password validation
  if (password == undefined || password.length == 0) {
    errors.push('Valid password is required.');
  }
  return errors;
}

function validateAgainstDB(email, password, usersCollection, callback) {
  usersCollection.findOne({"email": email}, function (err, user){
    var errors = [];
    assert.equal(err, null);
    if (user == null) {
      errors.push('No account exists for this email.');
    } else {

      if (user.password != password) {
        errors.push('Password is incorrect.');
      }
    }
    callback(errors, user);
  });
}

module.exports = router;
module.exports.validateLogin = validateLogin;
module.exports.validateAgainstDB = validateAgainstDB;