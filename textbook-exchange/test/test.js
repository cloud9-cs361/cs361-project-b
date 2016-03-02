var assert = require('assert');
var createAccount = require('../routes/createAccount');

describe('Validate Creation of Account', function() {
  describe('name', function () {
    it('name is provided by user', function () {
      var valid = createAccount.validateAccountCreation('', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('name is not undefined', function () {
      var valid = createAccount.validateAccountCreation(undefined, 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('name is valid', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(true, valid);
    });
  });
  describe('username', function () {
    it('username is provided by user', function () {
      var valid = createAccount.validateAccountCreation('validname', '', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('username is not undefined', function () {
      var valid = createAccount.validateAccountCreation('validname', undefined, 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('username not less than 8 characters', function () {
      var valid = createAccount.validateAccountCreation('validname', 'baduser', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('username is valid', function () {
      var valid = createAccount.validateAccountCreation('validname', 'g00duser', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(true, valid);
    });
    it('username does not contain symbols', function () {
      var valid = createAccount.validateAccountCreation('validname', '$ymbol.user', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('username is not a duplicate', function () {
      var valid = createAccount.validateAccountCreation('validname', 'duplicateuser', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
  });
  describe('password', function () {
    it('password is provided by user', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', '', 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('password is not undefined', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', undefined, 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('password not less than 8 characters', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'P$$w0rd', 'P$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('password not greater than 30 characters', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'This1sAReally$uperLongPassw0rd!', 'This1sAReally$uperLongPassw0rd!', '12345');
      assert.equal(false, valid);
    });
    it('password is valid', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(true, valid);
    });
    it('password contains at least one lowercase letter', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'BADPA$$W0RD', 'BADPA$$W0RD', '12345');
      assert.equal(false, valid);
    });
    it('password contains at least one uppercase letter', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'badpa$$w0rd', 'badpa$$w0rd', '12345');
      assert.equal(false, valid);
    });
    it('password contains at least one number', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'BadPa$$word', 'BadPa$$word', '12345');
      assert.equal(false, valid);
    });
    it('password contains at least one symbol', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'BadPassw0rd', 'BadPassw0rd', '12345');
      assert.equal(false, valid);
    });
  });
  describe('password2', function () {
    it('password2 matches password', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'Doe$N0tMatch', 'doe$N0tMatch', '12345');
      assert.equal(false, valid);
    });
    it('password2 is provided by user', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', '', '12345');
      assert.equal(false, valid);
    });
    it('password2 is not undefined', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', undefined, '12345');
      assert.equal(false, valid);
    });
  });
  describe('zip code', function () {
    it('zip code is provided by user', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', '');
      assert.equal(false, valid);
    });
    it('zip code is not undefined', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', undefined);
      assert.equal(false, valid);
    });
    it('zip code is valid', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(true, valid);
    });
    it('zip code is not more than 5 numbers', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', '123456');
      assert.equal(false, valid);
    });
    it('zip code is not less than 5 numbers', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', '1234');
      assert.equal(false, valid);
    });
    it('zip code does not contain letters', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', 'i2345');
      assert.equal(false, valid);
    });
    it('zip code does not contain symbols', function () {
      var valid = createAccount.validateAccountCreation('validname', 'gooduser', 'validpA$$w0rd', 'validpA$$w0rd', '!2345');
      assert.equal(false, valid);
    });
  });
});