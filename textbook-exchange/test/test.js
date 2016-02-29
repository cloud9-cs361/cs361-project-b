var assert = require('assert');
var createAccount = require('../routes/createAccount');

describe('Validate Creation of Account', function() {
  describe('username', function () {
    it('username not less than 8 characters', function () {
      var valid = createAccount.validateAccountCreation('name', 'baduser', 'validpA$$w0rd', 'validpA$$w0rd', '12345');
      assert.equal(false, valid);
    });
  });
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});