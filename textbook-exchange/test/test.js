var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return index when the value is present', function () {
      assert.equal(4, [1,2,3,4,5].indexOf(5));
    });
  });
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});