var express = require('express');
var router = express.Router();

// check to see if browser supports startsWith()
// if not, create it
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

/* GET add book form */
router.get('/', function(req, res, next){
    console.log(req.session);
    res.render('addBook', {isbn: '', title: '', author: '', edition: '', price: ''});
});

router.get('/checkISBN', function(req, res, next) {
    var isbn = req.query.isbn;
    // if keyword is ISBN then just throw ISBN13 into fuzzy search
    if (isbn != undefined && isISBN(isbn)) {
        isbn = conformISBN(isbn);
        console.log("ISBN Search detected: %s", isbn);
    }
    var db = req.app.get('db');
    var books = db.get('book');
    books.find({'isbn': isbn}, function(err, dbResult) {
        if (err) console.log(err);
        
        // didn't find isbn
        if(dbResult == undefined || dbResult.length == 0) {
            res.send(JSON.stringify({'found': false}));
        } else {
            res.send(JSON.stringify({'found': true, 'book': dbResult[0]}))
        }
    }); 
});

//Submit Book Info into Database
router.post('/',function(req,res){
    var isbn = req.body.isbn;
    var title = req.body.title;
    var author = req.body.author;
    var edition = req.body.edition;
    var price = req.body.price;
    console.log("Price=" + price);
    var status = "open";
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
    var priceErrors = validatePrice(price);
    errors = errors.concat(priceErrors);
    console.log(errors);
    var db = req.app.get('db');
    if (errors.length > 0) {
        res.render('addBook', {errors: errors, isbn: isbn, title: title, author: author, edition: edition, price: price}); // If the book is invalid should be only time we display an error
    }
    else {
        /* check database for book, if book exists then return id, if book does not exist then create book and return its id */
        insertOrGetBookId(book, books, function(ourBook) {
            /* Now get user from db current session */
            getUser(req.session.email, db, function(user) {
                /* Now insert new book instance with user_id, book, price */
                insertBookInstance(ourBook, user, price, status, db, function(err) {
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

function validateBookInfo(book) {
    var errors = [];
    
    if (book.isbn == undefined || book.isbn.length == 0) {
        errors.push('ISBN is required');
    }
    else {
        if (book.isbn.length == 14) {
             book.isbn = remove_isbn13_dash(book.isbn);
        }
        if (!isNumber(book.isbn)) {
            errors.push('Not a valid ISBN value');
            errors.push('Format must be (ISBN10) ########## or (ISBN13) ###-##########')
        }
        else if (book.isbn.length != 10 && book.isbn.length != 13) {
            errors.push('ISBN-10 or ISBN-13 must be given');
            errors.push('ISBN-10 will be converted to ISBN-13');
        }
        else if (book.isbn.length == 13 && !(book.isbn.startsWith('978') || book.isbn.startsWith('979'))) {
            errors.push('ISBN-13 must start with 978 or 979');
        }
        else {
            if (book.isbn.length == 10) {
                book.isbn = convert_isbn10_to_isbn13(book.isbn);
                if (book.isbn.length == 13 && !(book.isbn.startsWith('978') || book.isbn.startsWith('979'))) {
                    errors.push('ISBN-13 must start with 978 or 979');
                }
            }
        }
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
    else {
        if (!isNumber(book.edition)) {
            errors.push('Edition must be a number');
        }
    }
    
    return errors;
}

function validatePrice(price) {
    var errors = [];
    
    if (price == undefined || isNaN(price)) {
        errors.push('Price is required');
    }
    else {
        if (!isNumber(price)) {
            errors.push('Price must be a number');
        }
        if (price < 0) {
            errors.push('Price must be a positive number')
        }
    }
    
    return errors;
}

function isISBN(keyword) {
    console.log("Checking if isISBN [%s]", keyword);
    var temp = keyword;
    if (temp.length != 10 && temp.length != 13 && temp.length != 14) {
        return false;
    }
    if (temp.length == 14) {
        temp = remove_isbn13_dash(temp);
    }
    if (!isNumber(temp)) {
        return false;
    }
    if (temp.length == 10 || temp.length == 13) {
        return true;
    }
}

function conformISBN(isbn) {
    if (isbn.length == 14) {
        isbn = remove_isbn13_dash(isbn);
    }
    else if (isbn.length == 10) {
        isbn = convert_isbn10_to_isbn13(isbn);
    }
    return isbn;
}

function remove_isbn13_dash(isbn13) {
    return isbn13.replace('-','');
}

function convert_isbn10_to_isbn13(isbn10) {
    var isbn13 = "978";
    isbn13 += isbn10.substr(0, 9);
    var times3 = false;
    var sum = 0;
    for (var i = 0; i < isbn13.length; i++) {
        var digit = parseInt(isbn13[i]);
        if (times3) {
            digit *= 3;
        }
        sum += digit;
        times3 = !times3;
        
    }
    sum = 10 - (sum % 10);
    isbn13 += sum;
    return isbn13;
}

// source: http://stackoverflow.com/a/9716488/679716
function isNumber(isbn) {
    return (!isNaN(parseFloat(isbn)) && isFinite(isbn));
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

function insertBookInstance(book, user, price, status, db, callback) {
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
        'price':price,
        'status':status
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

module.exports = router;
module.exports.validateBookInfo = validateBookInfo;
module.exports.isISBN = isISBN;
module.exports.remove_isbn13_dash = remove_isbn13_dash;
module.exports.convert_isbn10_to_isbn13 = convert_isbn10_to_isbn13;
module.exports.conformISBN = conformISBN;
module.exports.validatePrice = validatePrice;