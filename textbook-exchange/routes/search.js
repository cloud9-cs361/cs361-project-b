var express = require('express');
var router = express.Router();
var bookFunctions = require('./addBook');
var geotools = require('./geotools');

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
    var db = req.app.get('db');
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
    
    advancedSearch(searchTerms, db, function(searchResults) {
        if (searchResults.errors.length != 0) {
            context.errors = searchResults.errors;
            res.render('search/advancedSearch', context);
        }
        else {
            context.foundBooks = searchResults.foundBooks;
            context.zip = zip;
            context.findZipDistance = geotools.findZipDistance;
            res.render('search/advancedSearch', context);
        }
    });
});

router.post('/',function(req,res){
    var db = req.app.get('db');
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
        findBooksByKeyword(searchKeyword, db, function(foundBooks) {
            var booksToRender = [];
            if (foundBooks != undefined) {
                var distancePromises = [];
                foundBooks.forEach(function(currentValue, index, array) {
                    var i = index;
                    var p = new Promise(function(resolve, reject) {
                        geotools.findZipDistance(zip, foundBooks[i].user.zip, function (distance) {
                            resolve({i: i, distance: distance});
                        });
                    });
                    var p2 = p.then(function(value) {
                        foundBooks[value.i].book.distance = value.distance;
                        booksToRender.push(foundBooks[value.i]);
                    });
                    distancePromises.push(p2);    
                });
                
                Promise.all(distancePromises).then(function(value) {
                    var context = {};
                    context.foundBooks = booksToRender;
                    context.zip = zip;
                    res.render('search/search', context);
                });
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

function advancedSearch(searchTerms, db, callback) {
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

function findBooksByKeyword(keyword, db, callback) {
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

function findBooksByKeywordAndZip(keyword, zip, db, callback) {
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

function findBooksByTitle(keyword, db, callback) {
    findBooksHelper('book.title', keyword, db, function(res) {
       callback(res); 
    });
}

function findBooksByISBN(keyword, db, callback) {
    findBooksHelper('book.isbn', keyword, db, function(res) {
       callback(res); 
    });
}

function findBooksByAuthor(keyword, db, callback) {
    findBooksHelper('book.author', keyword, db, function(res) {
       callback(res); 
    });
}

function findBooksByZip(keyword, db, callback) {
    findBooksHelper('user.zip', keyword, db, function(res) {
       callback(res); 
    });
}

function findBooksHelper(fieldName, keyword, db, callback) {
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

module.exports = router;

module.exports.findBooksByTitle = findBooksByTitle;
module.exports.findBooksByKeyword = findBooksByKeyword;
module.exports.findBooksByISBN = findBooksByISBN;
module.exports.findBooksByAuthor = findBooksByAuthor;
module.exports.findBooksByZip = findBooksByZip;