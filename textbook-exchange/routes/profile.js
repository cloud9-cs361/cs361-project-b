var express = require('express');
var router = express.Router();
var app = require('../app');
var db = app.dbo;

/* GET profile page. */
router.get('/', function(req, res, next) {
    var context = {};
    var name = req.session.name;
    var email = req.session.email;
    
    context.name = name;
    context.email = email;
    console.log(name);
    console.log(email);
    fetchUserBooks(email, function(userBooks) {
        if (userBooks == null || userBooks.length == 0) {
            console.log("No books found for: %s", email);
            res.render('profile', context);
        } 
        else {
            context.userBooks = userBooks;
            res.render('profile', context);
        }
    });
    
});

function fetchUserBooks(email, callback) {
    var bookInstances = db.get('book_instance');
    var users = db.get('users');
    var books = db.get('book');

    users.findOne({'email':email}, function(err, user) {
        if (err) console.log(err);

        // found user..
        if (user != undefined) {
            bookInstances.find({'user_id':user._id}, function(err, instances) {
                 if (err) console.log(err);

                 // found book instances for user ....
                 if (instances.length != 0) {
                     var userBooks = [];
                     // build list of book_ids
                     for (var i = 0; i < instances.length; i++) {
                         if (instances[i].book != undefined) {
                             
                             userBooks.push(instances[i]);
                         }
                     }
                     callback(userBooks);
                 }
                 else {
                     // if we have no instances
                     callback(null);
                 }
            });
        }
        else {
            callback(null);
        }
    });
}

module.exports = router;
