var assert = require('assert');
var createAccount = require('../routes/createAccount');
var login = require('../routes/login');
var db = require('monk')('localhost/bookr');

// still need tests to make sure email and password are valid for account when logging in

// Tests for Logging In
describe('Validate Login', function() {
  describe('name', function () {
    it('name is provided by user', function () {
      var errors = login.validateLogin('', 'good@email.com', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("Name")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('name is not undefined', function () {
      var errors = login.validateLogin(undefined, 'good@email.com', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("Name")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('name is valid', function () {
      var errors = login.validateLogin('validname', 'good@email.com', 'validpA$$w0rd');
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
  describe('email', function () {
    it('email is provided by user', function () {
      var errors = login.validateLogin('validname', '', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email is not undefined', function () {
      var errors = login.validateLogin('validname', undefined, 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email does not contain @', function () {
      var errors = login.validateLogin('validname', 'bademail.com', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email does not contain .', function () {
      var errors = login.validateLogin('validname', 'bad@emailcom', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email does not contain . or @', function () {
      var errors = login.validateLogin('validname', 'bademailcom', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email is valid', function () {
      var errors = login.validateLogin('validname', 'good@email.com', 'validpA$$w0rd');
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email exists in usersCollection', function (done) {
      var usersCollection = db.get('testUsers');
      usersCollection.remove({'email': 'nonexistent@email.com'});
      login.validateAgainstDB('nonexistent@email.com', 'validpA$$w0rd', usersCollection, function(errors) {
        var expectedErrors = [
          error => error.includes("No account")
        ];
        assert.equal(expectedErrors.length, errors.length, errors.toString());
        expectedErrors.every(expected => errors.some(expected));
        done();
      });
    });
  });
  describe('password', function () {
    it('password is provided by user', function () {
      var errors = login.validateLogin('validname', 'good@email.com', '');
      var expectedErrors = [
        error => error.includes("password")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password is not undefined', function () {
      var errors = login.validateLogin('validname', 'good@email.com', undefined);
      var expectedErrors = [
        error => error.includes("password") 
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password does not match expected password for user account', function (done) {
      var usersCollection = db.get('testUsers');
      usersCollection.insert({'email': 'good@email.com', 'password': 'validpA$$w0rd'});
      login.validateAgainstDB('good@email.com', 'doe$N0tMatch', usersCollection, function(errors) {
        usersCollection.remove({'email': 'good@email.com', 'password': 'validpA$$w0rd'});
        var expectedErrors = [
          error => error.includes("incorrect")
        ];
        assert.equal(expectedErrors.length, errors.length, errors.toString());
        expectedErrors.every(expected => errors.some(expected));
        done();
      });
    });
    it('password is valid', function () {
      var errors = login.validateLogin('validname', 'good@email.com', 'validpA$$w0rd');
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
});

// Tests for Creating an Account
describe('Validate Creation of Account', function() {
  describe('name', function () {
    it('name is provided by user', function () {
      var errors = createAccount.validateAccountCreation('', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("Name")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('name is not undefined', function () {
      var errors = createAccount.validateAccountCreation(undefined, 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("Name")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('name is valid', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
  describe('email', function () {
    it('email is provided by user', function () {
      var errors = createAccount.validateAccountCreation('validname', '', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email is not undefined', function () {
      var errors = createAccount.validateAccountCreation('validname', undefined, 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email does not contain @', function () {
      var errors = createAccount.validateAccountCreation('validname', 'bademail.com', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email does not contain .', function () {
      var errors = createAccount.validateAccountCreation('validname', 'bad@emailcom', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email does not contain . or @', function () {
      var errors = createAccount.validateAccountCreation('validname', 'bademailcom', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email is not a duplicate', function (done) {
      var usersCollection = db.get('testUsers');
      usersCollection.insert({"email": 'duplicate@email.com'});
      createAccount.validateAgainstDB('duplicate@email.com', usersCollection, function(errors) {
        usersCollection.remove({"email": 'duplicate@email.com'});
        var expectedErrors = [
          error => error.includes("already exists")
        ];
        assert.equal(expectedErrors.length, errors.length, errors.toString());
        expectedErrors.every(expected => errors.some(expected));
        done();
      });
    });
    it('email is valid', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
  describe('password', function () {
    it('password is provided by user', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', '', 'validpA$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("Password"),
        error => error.includes("lowercase"),
        error => error.includes("uppercase"),
        error => error.includes("number"),
        error => error.includes("symbol"),
        error => error.includes("Both passwords")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password is not undefined', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', undefined, 'validpA$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("Password"), 
        error => error.includes("Both passwords")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password not less than 8 characters', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'P$$w0rd', 'P$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("Password")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password not greater than 30 characters', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'This1sAReally$uperLongPassw0rd!', 'This1sAReally$uperLongPassw0rd!', '12345');
      var expectedErrors = [
        error => error.includes("Password")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password contains at least one lowercase letter', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'BADPA$$W0RD', 'BADPA$$W0RD', '12345');
      var expectedErrors = [
        error => error.includes("lowercase")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password contains at least one uppercase letter', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'badpa$$w0rd', 'badpa$$w0rd', '12345');
      var expectedErrors = [
        error => error.includes("uppercase")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password contains at least one number', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'BadPa$$word', 'BadPa$$word', '12345');
      var expectedErrors = [
        error => error.includes("number")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password contains at least one symbol', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'BadPassw0rd', 'BadPassw0rd', '12345');
      var expectedErrors = [
        error => error.includes("symbol")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password is valid', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
  describe('password2', function () {
    it('password2 matches password', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'Doe$N0tMatch', 'doe$N0tMatch', '12345');
      var expectedErrors = [
        error => error.includes("Both passwords")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password2 is provided by user', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', '', '12345');
      var expectedErrors = [
        error => error.includes("Both passwords")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password2 is not undefined', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', undefined, '12345');
      var expectedErrors = [
        error => error.includes("Both passwords")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password2 is valid', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
  describe('zip code', function () {
    it('zip code is provided by user', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '');
      var expectedErrors = [
        error => error.includes("Zip code"),
        error => error.includes("exactly 5 numbers")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('zip code is not undefined', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', undefined);
      var expectedErrors = [
        error => error.includes("Zip code")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('zip code is not more than 5 numbers', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '123456');
      var expectedErrors = [
        error => error.includes("exactly 5 numbers")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('zip code is not less than 5 numbers', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '1234');
      var expectedErrors = [
        error => error.includes("exactly 5 numbers")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('zip code does not contain letters', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', 'i2345');
      var expectedErrors = [
        error => error.includes("not contain any letters"),
        error => error.includes("exactly 5 numbers")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('zip code does not contain symbols', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '!2345');
      var expectedErrors = [
        error => error.includes("not contain any symbols"),
        error => error.includes("exactly 5 numbers")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('zip code is valid', function () {
      var errors = createAccount.validateAccountCreation('validname', 'good@email.com', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
});