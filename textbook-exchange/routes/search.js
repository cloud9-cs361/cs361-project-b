var express = require('express');
var router = express.Router();

/* GET search page. */
router.get('/', function(req, res, next) {
    res.render('search', context);
});

router.post('/',function(req,res){
    var db = req.app.get('db');
    var name = req.session.name;
    var email = req.session.email;
    var zip = req.session.zip;
    var searchKeyword = req.body.searchKeyword;

    var bookInstances = db.get('book_instance');
    var users = db.get('users');
    var errors = validateSearch(searchKeyword,zip);
    
    /*Search for the Book or Report Error to User*/
    if (errors.length == 0) {
        findBooksByKeyword(bookInstances, searchKeyword, function(foundBooks) {
            if (foundBooks != undefined) {
                var context = {};
                context.foundBooks = foundBooks;
                console.log(foundBooks);
                res.render('search', context);
            }
            else {
                errors.push("No match found");
                res.render('search', {errors: errors});
            }
        });
    }
    else{
        res.render('search', {errors: errors});
    }
    
});

/*Check the user has input search terms*/
function validateSearch(searchKeyword,zipCode){
    console.log(zipCode);
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

function findBooksByKeyword(bookInstances, keyword, callback) {
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

function findBooksByTitle(bookInstances, keyword, callback) {
    var foundBooks = [];
    bookInstances.find({'book.title': {$regex: keyword, $options: 'i'}},
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




/*Retrieve Matching Search Results*/
/*function fetchMatchISBN(searchKeyword){
    var bookInstances = db.get('book_instance');
    var users = db.get('users');
    var books = db.get('book');
    
    books.find({'isbn':searchKeyword}, function(){

            
    });
    
}*/

module.exports = router;
module.exports.findBooksByTitle = findBooksByTitle;
module.exports.findBooksByKeyword = findBooksByKeyword;