var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {
    var db = req.app.get('db');

    var context = {};
    var name = req.session.name;
    var email = req.session.email;
    
    context.name = name;   // Get from objects
    // context.name = req.session.name = object.name  something like that
    context.email = email;
    console.log(name);
    console.log(email);
    fetchUserBooks(db, function(userBooks) {
        
        if (userBooks.length == 0) {
            console.log("Not including books");
            res.render('profile', context);
        } 
        else {
            context.books = userBooks;
            res.render('profile', context);
        }
    });
    
});

function fetchUserBooks(db, callback) {
    var userBooks = db.get('book_instance');
    callback({
        'testcode':"testing"
    });
}

module.exports = router;
