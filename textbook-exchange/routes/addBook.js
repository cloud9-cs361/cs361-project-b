var express = require('express');
var router = express.Router();

/* GET add book form */
router.get('/', function(req, res, next){
    console.log(req.session);
    res.render('addBook');
});

//Submit Book Info into Database
router.post('/',function(req,res){
    var isbn = req.body.isbn;
    var title = req.body.title;
    var author = req.body.author;
    var edition = req.body.edition;
    var price = req.body.price;
    var db = req.app.get('db');
    var books = db.get('book');
    var book = {
        'isbn':isbn,
        'title':title,
        'author':author,
        'edition':edition
    };
    
    /* validate information to see if possible valid book */    
    var errors = validateBookInfo(book);
    console.log(errors);
    if (errors.length > 0) {
        res.render('addBook', {errors: errors}); // If the book is invalid should be only time we display an error
    }
    else {
        /* check database for book, if book exists then return id, if book does not exist then create book and return its id */
        insertOrGetBookId(book, books, function(ourBook) {
              
            /* Now get user from db current session */
            getUser(req.session.email, db, function(user) {
                /* Now insert new book instance with user_id, book, price */
                insertBookInstance(ourBook, user, price, db, function(err) {
                    if (err == null) {
                        res.redirect('/profile');
                    }
                    else {
                        res.render('profile', {errors: err});
                    }
                });
            });
        });
    }
});

function insertBookInstance(book, user, price, db, callback) {
    var book_instances = db.get('book_instance');
    var book_instance = {
        'book_id':book._id,
        'user_id':user._id,
        'book':book,
        'user' : {
            'email':user.email,
            'name':user.name,
            'zip': user.zip,
            '_id':user._id
        },
        'price':price
    };
    book_instances.insert(book_instance, function(err, newInstance) {
       if (err) {
           console.log("ERROR INSERTING BOOK_INSTANCE: " + err);
           callback(err);
       }
       else {
           console.log("SUCCESS");
           callback(null);
       }
    });
}

function getUser(email, db, callback) {
    var users = db.get('users');
    
    users.findOne({'email': email}, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (user.length != 0) {
            callback(user);
        }
    });
}

function insertOrGetBookId(book, books, callback) {
    var error = [];

    books.findOne({"isbn": book.isbn}, function (err, existingBook){
        if (err) {
            console.log("Error in finding book: " + err);
        }
        
        if (existingBook == undefined) {
            // insert book
            books.insert(book, function(err, newBook) {
               if (err) console.log(err);
               else {
                   console.log("Inserting %j", newBook);
                   callback(newBook);
               }
            });
        }
        else {
            console.log("Book exists");
            callback(existingBook);
        }
        
    });
}


function validateBookInfo(book) {
    var errors = [];
    
    if (book.isbn == undefined || book.isbn.length == 0) {
        errors.push('ISBN is required.');
    }
    
    if (book.title == undefined || book.title.length == 0) {
        errors.push('Title is required');
    }
    
    if (book.author == undefined || book.author.length == 0) {
        errors.push('Author is required');        
    }
    
    if (book.edition == undefined || book.edition.length == 0) {
        errors.push('Edition is required');
    }
    return errors;
}

module.exports = router;
module.exports.validateBookInfo = validateBookInfo;