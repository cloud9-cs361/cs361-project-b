var express = require('express');
var router = express.Router();
var app = require('../app');
var db = app.dbo;

/* GET search page. */
router.get('/', function(req, res, next) {
    res.render('search', context);
});

router.post('/',function(req,res){
    
    var name = req.session.name;
    var email = req.session.email;
    var zip = req.session.zip;
    var searchZip = req.body.zipCode;
    var searchKeyword = req.body.searchKeyword;

    var bookInstances = db.get('book_instance');
    var users = db.get('users');
    
    var errors;
    
    if (searchZip == undefined) {
        errors = validateSearch(searchKeyword,zip);
    }
    else {
        errors = validateSearch(searchKeyword, searchZip);
    }
    
    /*Search for the Book or Report Error to User*/
    if (errors.length == 0) {
        if (searchZip == undefined) {
            findBooksByKeyword(searchKeyword, function(foundBooks) {
                if (foundBooks != undefined) {
                    var context = {};
                    context.foundBooks = foundBooks;
                    res.render('search', context);
                }
                else {
                    errors.push("No match found");
                    res.render('search', {errors: errors});
                }
            });
        }
        else {
            findBooksByKeywordAndZip(searchKeyword, searchZip, function(foundBooks) {
                if (foundBooks != undefined) {
                    var context = {};
                    context.foundBooks = foundBooks;
                    res.render('search', context);
                } 
                else {
                    errors.push("No books found with this zip code: %s", searchZip);
                    res.render('search', {errors:errors});
                }
            });
        }
    }
    else{
        res.render('search', {errors: errors});
    }
    
});

/*Check the user has input search terms*/
function validateSearch(searchKeyword,zipCode){
    var errors = [];
    
    // searchKeyword validation
    if (searchKeyword == undefined || searchKeyword.length == 0) {
        errors.push('Search Terms are required.');
    }
    
    // ZipCode validation
    if (zipCode == undefined || zipCode.length != 5) {
        errors.push('Zipcode is required.');
    }
    
    return errors;
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