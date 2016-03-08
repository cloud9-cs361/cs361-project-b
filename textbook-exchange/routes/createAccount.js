var express = require('express');
var router = express.Router();
var assert = require('assert');

function validateAccountCreation(name, email, password, password2, zip) {
  var errors = [];
  
  // name validation
  if (name == undefined || name.length == 0) {
    errors.push('Name is required.');
  }
  
  // email validation
  if (email == undefined || email.length == 0 || !(email.includes('@') && email.includes('.'))) {
    errors.push('Valid email address is required.');
  }
  
  // password validation
  if (password == undefined || password.length == 0 || password.length < 8 || password.length > 30) {
    errors.push('Password must be greater than or equal to 8 characters and less than or equal to 30 characters long.');
  }
  
  var lcase = /.*[a-z].*/;
  var ucase = /.*[A-Z].*/;
  var number = /.*[0-9].*/;
  var symbol = /.*[!@#$%^&*].*/;
  
  if (password != undefined) {
    if (!password.match(lcase)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!password.match(ucase)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!password.match(number)) {
      errors.push('Password must contain at least one number.');
    }
    if (!password.match(symbol)) {
      errors.push('Password must contain at least one symbol.');
    }
  }
  
  // confirm password validation
  if (password2 == undefined || password2.length == 0 || !(password2 == password)) {
    errors.push('Both passwords must match.');
  }
  
  // zip code validation
  if (zip == undefined || zip.length == 0) {
    errors.push('Zip code is required.');
  }
  
  var zipLength = /^[0-9]{5}$/;
  var zipLetter = /.*[a-zA-Z].*/;
  var zipSymbol = /.*[!@#$%^&*].*/;
  
  if (zip != undefined) {
    if (!zip.match(zipLength)) {
      errors.push('Zip code must be exactly 5 numbers long.');
    }
    if (zip.match(zipLetter)) {
      errors.push('Zip code must not contain any letters.');
    }
    if (zip.match(zipSymbol)) {
      errors.push('Zip code must not contain any symbols.');
    }
  }
  
  return errors;

  
}

function validateAgainstDB(email, usersCollection, callback) {
  usersCollection.find({"email": email}, function (err, docs){
    
    var errors = [];
    assert.equal(err, null);

    // currentling working
    if (docs.length != 0) {
      console.error("Trying to create an account with an email that already exists");
      console.log(docs);
      errors.push('Account already exists for this email.');
    }
    else {
      console.info("New user created: " + email);
    }
    
    callback(errors);
    });
}


/* GET createAccount page. */
router.get('/', function(req, res, next) {
  res.render('createAccount');
});

router.post('/', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var pw = req.body.password;
  var pw2 = req.body.password2;
  var zip = req.body.zip;
  var db = req.app.get('db');
  var usersCollection = db.get('users');
  
  var errors = validateAccountCreation(name, email, pw, pw2, zip);
  
  validateAgainstDB(email, usersCollection, function (dbErrors) {
    
    errors = errors.concat(dbErrors);
    
    if (errors.length == 0) {
      // write user info to database
      var usersCollection = req.app.db.get('users');
      usersCollection.insert({
        'email': req.body.email, 
        'name': req.body.name, 
        'password': req.body.password, // should be hashed
        'zip': req.body.zip
      }, function (err, doc) {
        if (err) {
          // If there was a problem adding account info to database, return error
          console.log("ERROR");
          console.log(err);
          res.send("There was a problem adding your account information to the database.");
        } else {
          // Add name and email to session
          req.session.name = req.body.name;
          req.session.email = req.body.email;
          res.redirect('/profile');
        }
      });
    }
    else {
      res.render('createAccount', {errors: errors});
    }
  });
});

module.exports = router;

module.exports.validateAccountCreation = validateAccountCreation;
module.exports.validateAgainstDB = validateAgainstDB;