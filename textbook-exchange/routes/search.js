var express = require('express');
var router = express.Router();
var app = require('../app');
var db = app.dbo;
var bookFunctions = require('./addBook');

/* GET search page. */
router.get('/advancedSearch', function(req, res, next) {
   res.render('search/advancedSearch'); 
});

router.get('/search', function(req, res, next) {
    res.render('search/search');
});

router.get('/', function(req, res, next) {
    console.log(req);
    res.render('search/search');
});

router.post('/advancedSearch', function(req, res, next) {
    var isbn = req.body.isbn;
    var title = req.body.title;
    var author = req.body.author;
    var zip = req.body.zipCode;
    var context = {};
    
    // if keyword is ISBN then just throw ISBN13 into fuzzy search
    if (isbn != undefined && bookFunctions.isISBN(isbn)) {
        isbn = bookFunctions.conformISBN(isbn);
        console.log("ISBN Search detected: %s", isbn);
    }

    var searchTerms = {
        'isbn': isbn,
        'title': title,
        'author': author,
        'zip': zip
    };

    advancedSearch(searchTerms, function(searchResults) {
        if (searchResults.errors.length != 0) {
            context.errors = searchResults.errors;
            res.render('search/advancedSearch', context);
        }
        else {
            context.foundBooks = searchResults.foundBooks;
            res.render('search/advancedSearch', context);
        }
    });
});

router.post('/',function(req,res){
    console.log(req.body);
    var zip = req.session.zip;
    var searchKeyword = req.body.searchKeyword;

    var errors = validateSearch(searchKeyword, zip);
    
    // if keyword is ISBN then just throw ISBN13 into fuzzy search
    if (searchKeyword != undefined && bookFunctions.isISBN(searchKeyword)) {
        searchKeyword = bookFunctions.conformISBN(searchKeyword);
        console.log("ISBN Search detected: %s", searchKeyword);
    }
    /*Search for the Book or Report Error to User*/
    if (errors.length == 0) {
        findBooksByKeyword(searchKeyword, function(foundBooks) {
            if (foundBooks != undefined) {
                var context = {};
                context.foundBooks = foundBooks;
                res.render('search/search', context);
            }
            else {
                errors.push("No match found");
                res.render('search/search', {errors: errors});
            }
        });
    }
    else{
        res.render('search/search', {errors: errors});
    }
});

/*Check the user has input search terms*/
function validateSearch(searchKeyword){
    var errors = [];
    
    // searchKeyword validation
    if (searchKeyword == undefined || searchKeyword.length == 0) {
        errors.push('Search Terms are required.');
    }
    
    return errors;
};

function advancedSearch(searchTerms, callback) {
  var bookInstances = db.get('book_instance');
  var errors = [];
  var foundBooks = [];
  var searchResults = {
      'errors':errors,
      'foundBooks':foundBooks
  };

  var wildcard = ".*";
  // not finished -- going to make undefined equal regex anything
  var isbn = (searchTerms.isbn == undefined || searchTerms.isbn.length == 0) ? wildcard : searchTerms.isbn;
  var title = (searchTerms.title == undefined || searchTerms.title.length == 0) ? wildcard : searchTerms.title;
  var author = (searchTerms.author == undefined || searchTerms.author.length == 0) ? wildcard : searchTerms.author;
  var zip = (searchTerms.zip == undefined || searchTerms.zip.length == 0) ? wildcard : searchTerms.zip;
  console.log("OUR ISBN IS: ",isbn);
  console.log("OUR TITLE IS: ",title);
  console.log("OUR AUTHOR IS: ",author);
  console.log("OUR ZIP IS: ",zip);
  bookInstances.find({ $and: [
    {'book.title': {$regex: title, $options: 'i'}}, 
    {'book.isbn' : {$regex: isbn, $options: 'i'}},
    {'book.author' : {$regex: author, $options: 'i'}},
    {'user.zip' : {$regex: zip, $options: 'i'}}
    ]},
    
    function(err, books) {
        if (err) console.log(err);
        if (books.length != 0) {
            for (var i = 0; i < books.length; i++) {
                foundBooks.push(books[i]);
            }
            callback(searchResults);
        }
        else {
            console.log(books);
            console.log("Not found: %s", JSON.parse(JSON.stringify(searchResults)));
            errors.push("Your search did not yield any results");
            callback(searchResults);
        }
    });
};

function findBooksByKeyword(keyword, callback) {
    var bookInstances = db.get('book_instance');
    var foundBooks = [];
    bookInstances.find({ $or: [
        {'book.title': {$regex: keyword, $options: 'i'}}, 
        {'book.isbn' : {$regex: keyword, $options: 'i'}},
        {'book.author' : {$regex: keyword, $options: 'i'}},
        {'user.zip' : {$regex: keyword, $options: 'i'}}
        ]},
        
        function(err, books) {
            if (err) console.log(err);
            if (books.length != 0) {
                for (var i = 0; i < books.length; i++) {
                    foundBooks.push(books[i]);
                }
                callback(foundBooks);
            }
            else {
                callback(null);
            }
        }
    );
}

function findBooksByKeywordAndZip(keyword, zip, callback) {
    var bookInstances = db.get('book_instance');
    var foundBooks = [];
    bookInstances.find({
        $and: [
            {$or: [
                {'book.title': {$regex: keyword, $options: 'i'}}, 
                {'book.isbn' : {$regex: keyword, $options: 'i'}},
                {'book.author' : {$regex: keyword, $options: 'i'}}]},
            {'user.zip' : {$regex: zip, $options: 'i'}}
        ]}, 
        
        function(err, books) {
            if (err) console.log(err);
            if (books.length != 0) {
                for (var i = 0; i < books.length; i++) {
                    foundBooks.push(books[i]);
                }
                callback(foundBooks);
            }
            else {
                callback(null);
            }
        }
    );
}

function findBooksByTitle(keyword, callback) {
    findBooksHelper('book.title', keyword, function(res) {
       callback(res); 
    });
}

function findBooksByISBN(keyword, callback) {
    findBooksHelper('book.isbn', keyword, function(res) {
       callback(res); 
    });
}

function findBooksByAuthor(keyword, callback) {
    findBooksHelper('book.author', keyword, function(res) {
       callback(res); 
    });
}

function findBooksByZip(keyword, callback) {
    findBooksHelper('user.zip', keyword, function(res) {
       callback(res); 
    });
}

function findBooksHelper(fieldName, keyword, callback) {
    var bookInstances = db.get('book_instance');
    var params = {$regex: keyword, $options: 'i'};
    var query = {};
    query[fieldName] = params;
    
    var foundBooks = [];
    bookInstances.find(query, function(err, books) {
        if (err) console.log(err);
        if (books.length != 0) {
            for (var i = 0; i < books.length; i++) {
                foundBooks.push(books[i]);
            }
            callback(foundBooks);
        }
        else {
            callback(null);
        }
    });
}

exports.findBooksByTitle = findBooksByTitle;
exports.findBooksByKeyword = findBooksByKeyword;
exports.findBooksByISBN = findBooksByISBN;
exports.findBooksByAuthor = findBooksByAuthor;
exports.findBooksByZip = findBooksByZip;
module.exports = router;