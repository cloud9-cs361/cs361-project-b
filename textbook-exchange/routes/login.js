var express = require('express');
var router = express.Router();
var assert = require('assert');

function validateLogin(email, password) {
  var errors = [];
  // email validation
  if (email == undefined || email.length == 0 || !(email.includes('@') && email.includes('.'))) {
    errors.push('Valid email address is required.');
  }
  // password validation
  if (password == undefined || password.length == 0) {
    errors.push('Valid password is required.');
  }
  return errors;
}

function validateAgainstDB(email, password, usersCollection, callback) {
  usersCollection.findOne({"email": email}, function (err, doc){
    var errors = [];
    var name = "";
    assert.equal(err, null);
    if (doc == null) {
      errors.push('No account exists for this email.');
    } else {
      name = doc.name;
      if (doc.password != password) {
        errors.push('Password is incorrect.');
      }
    }
    callback(errors, name);
  });
}

router.get('/', function(req, res, next){
    res.render('login');
});

router.post('/', function(req, res) {
  var errors = validateLogin(req.body.email, req.body.password);
  validateAgainstDB(req.body.email, req.body.password, req.app.db.get('users'), function (dbErrors, name) {
    errors = errors.concat(dbErrors);
    if (errors.length == 0) {
      // Add name and email to session
      req.session.name = name;
      req.session.email = req.body.email;
      res.redirect('/profile');
    }
    else {
      res.render('login', {errors: errors});
    }
  });
});

module.exports = router;

module.exports.validateLogin = validateLogin;
module.exports.validateAgainstDB = validateAgainstDB;