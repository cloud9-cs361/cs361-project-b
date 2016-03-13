var assert = require('assert');
var createAccount = require('../routes/createAccount');
var login = require('../routes/login');
var addBook = require('../routes/addBook');
var db = require('monk')('localhost/bookr');
var search = require('../routes/search');

// check to see if browser supports startsWith()
// if not, create it
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

// Tests for Logging In
describe('Validate Login', function() {
  describe('email', function () {
    it('email is provided by user', function () {
      var errors = login.validateLogin('', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email is not undefined', function () {
      var errors = login.validateLogin(undefined, 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email does not contain @', function () {
      var errors = login.validateLogin('bademail.com', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email does not contain .', function () {
      var errors = login.validateLogin('bad@emailcom', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email does not contain . or @', function () {
      var errors = login.validateLogin('bademailcom', 'validpA$$w0rd');
      var expectedErrors = [
        error => error.includes("email")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('email is valid', function () {
      var errors = login.validateLogin('good@email.com', 'validpA$$w0rd');
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
      var errors = login.validateLogin('good@email.com', '');
      var expectedErrors = [
        error => error.includes("password")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('password is not undefined', function () {
      var errors = login.validateLogin('good@email.com', undefined);
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
      var errors = login.validateLogin('good@email.com', 'validpA$$w0rd');
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

// Tests for Adding a Book
describe('Validate Adding a Book', function() {
  describe('isbn', function () {
    it('isbn is provided by user', function () {
      var isbn = '';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("ISBN is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn is not undefined', function () {
      var isbn = undefined;
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("ISBN is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn is a number', function () {
      var isbn = 'contains1ttrs';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("Not a valid ISBN value"),
        error => error.includes("Format must be (ISBN10) ########## or (ISBN13) ###-##########")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn is 10 or 13 digits long', function () {
      var isbn = '123456789012';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("ISBN-10 or ISBN-13 must be given"),
        error => error.includes("ISBN-10 will be converted to ISBN-13")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn13 starts with 978 or 979', function () {
      var isbn = '1231615641529';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      assert.equal(isbn.length == 13, true);
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("ISBN-13 must start with 978 or 979")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn with 14 digits starts with 978 or 979', function () {
      var isbn = '123-1615641529';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      assert.equal(isbn.length == 14, true);
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("ISBN-13 must start with 978 or 979")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn is valid 13 digit starting with 978', function () {
      var isbn = '9781615641529';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      assert.equal(isbn.length == 13, true);
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn is valid 13 digit starting with 979', function () {
      var isbn = '9791615641529';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      assert.equal(isbn.length == 13, true);
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn is valid 14 digit starting with 978', function () {
      var isbn = '978-1615641529';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      assert.equal(isbn.length == 14, true);
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn is valid 14 digit starting with 979', function () {
      var isbn = '979-1615641529';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      assert.equal(isbn.length == 14, true);
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('isbn is valid 10 digit', function () {
      var isbn = '1234567890';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      assert.equal(isbn.length == 10, true);
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
  describe('title', function () {
    it('title is provided by user', function () {
      var isbn = '9781615641529';
      var title = '';
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("Title is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('title is not undefined', function () {
      var isbn = '9781615641529';
      var title = undefined;
      var author = 'Good Author';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("Title is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
  describe('author', function () {
    it('author is provided by user', function () {
      var isbn = '9781615641529';
      var title = 'Good Title';
      var author = '';
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("Author is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('author is not undefined', function () {
      var isbn = '9781615641529';
      var title = 'Good Title';
      var author = undefined;
      var edition = '3';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("Author is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
  describe('edition', function () {
    it('edition is provided by user', function () {
      var isbn = '9781615641529';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = '';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("Edition is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('edition is not undefined', function () {
      var isbn = '9781615641529';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = undefined;
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("Edition is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('edition is a number', function () {
      var isbn = '9781615641529';
      var title = 'Good Title';
      var author = 'Good Author';
      var edition = 'a';
      var book = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'edition': edition
      };
      var errors = addBook.validateBookInfo(book);
      var expectedErrors = [
        error => error.includes("Edition must be a number")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
  describe('isISBN', function () {
    it('isbn is not 10, 13, or 14 digits long', function () {
      var isbn = '978161564152';
      var valid = addBook.isISBN(isbn);
      assert.equal(valid, false);
    });
    it('isbn is only digits', function () {
      var isbn = 'contains1ttrs';
      var valid = addBook.isISBN(isbn);
      assert.equal(valid, false);
    });
    it('isbn is 14 digits long', function () {
      var isbn = '978-1615641529';
      var valid = addBook.isISBN(isbn);
      assert.equal(valid, true);
    });
    it('isbn is 13 digits long', function () {
      var isbn = '9781615641529';
      var valid = addBook.isISBN(isbn);
      assert.equal(valid, true);
    });
    it('isbn is 10 digits long', function () {
      var isbn = '1615641521';
      var valid = addBook.isISBN(isbn);
      assert.equal(valid, true);
    });
  });
  describe('conformISBN', function () {
    it('isbn is converted from 14 digits to 13 digits', function () {
      var isbn = '978-1615641529';
      assert.equal(isbn.length == 14, true);
      assert.equal(isbn.indexOf("-") > -1, true);
      isbn = addBook.conformISBN(isbn);
      assert.equal(isbn.length == 13, true);
      assert.equal(isbn.indexOf("-") > -1, false);
    });
    it('isbn is converted from 10 digits to 13 digits', function () {
      var isbn = '1615641521';
      assert.equal(isbn.length == 10, true);
      isbn = addBook.conformISBN(isbn);
      assert.equal(isbn == '9781615641529', true);
    });
  });
  describe('price', function () {
    it('price is provided by user', function () {
      var price = NaN;
      var errors = addBook.validatePrice(price);
      var expectedErrors = [
        error => error.includes("Price is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('price is not undefined', function () {
      var price = undefined;
      var errors = addBook.validatePrice(price);
      var expectedErrors = [
        error => error.includes("Price is required")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('price is a number', function () {
      var price = 'a';
      var errors = addBook.validatePrice(price);
      var expectedErrors = [
        error => error.includes("Price must be a number")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('price is a positive number', function () {
      var price = '-1';
      var errors = addBook.validatePrice(price);
      var expectedErrors = [
        error => error.includes("Price must be a positive number")
      ];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
});

// Tests for Search for a Book
describe('Validate Searching for a Book', function() {
  describe('search', function () {
    var author = 'Robert Ludlum';
    var title = 'The Bourne Identity';
    var isbn = '9780553593549';
    var zip = '98199';
    it('search works by author', function () {
      var errors = search.findBooksByAuthor(author, function(books) {
        var found = false;
        for(var i = 0; i < books.length; i++) {
          if(books[i].book.title == title 
          && books[i].book.uthor == author
          && books[i].book.isbn == isbn) {
            found = true;
          }
        }
        assert(found,true);
      });
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('search works by title', function () {
      var errors = search.findBooksByTitle(title, function(books) {
        var found = false;
        for(var i = 0; i < books.length; i++) {
          if(books[i].book.title == title 
          && books[i].book.author == author 
          && books[i].book.isbn == isbn) {
            found = true;
          }
        }
        assert(found,true);
      });
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('search works by isbn', function () {
      var errors = search.findBooksByISBN(isbn, function(books) {
        var found = false;
        for(var i = 0; i < books.length; i++) {
          if(books[i].book.title == title 
          && books[i].book.author == author 
          && books[i].book.isbn == isbn) {
            found = true;
          }
        }
        assert(found,true);
      });
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
    it('search works by zip', function () {
      var errors = search.findBooksByZip(zip, function(books) {
        var found = false;
        for(var i = 0; i < books.length; i++) {
          if(books[i].book.title == title 
          && books[i].book.author == author 
          && books[i].book.isbn == isbn) {
            found = true;
          }
        }
        assert(found,true);
      });
      var expectedErrors = [];
      assert.equal(expectedErrors.length, errors.length, errors.toString());
      expectedErrors.every(expected => errors.some(expected));
    });
  });
});