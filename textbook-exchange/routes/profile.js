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
    
    console.log('profile.js (load): %s', name);
    console.log('profile.js (load): %s', email);
 
    fetchUserBooks(email, function(userBooks) {   
        if (userBooks == null || userBooks.length == 0) {
            console.log("No books found for: %s", email);
            res.render('profile', context);
        } 
        else {
            context.userBooks = userBooks;
        }
        
        fetchUserRequests(email, function(userRequests){
            if (userRequests == null || userRequests.length == 0){
                console.log("No requests found for: %s", email);
            }
            else{
                context.userRequests = userRequests;

            }
            res.render('profile', context);
        });
        
    });
    
});

router.get('/checkISBN', function(req, res, next) {
    var books = db.get('book');
    books.find({'isbn': req.query.isbn}, function(err, dbResult) {
        if (err) console.log(err);
        
        // didn't find isbn
        if(dbResult == undefined || dbResult.length == 0) {
            res.send(JSON.stringify({'found': false}));
        } else {
            res.send(JSON.stringify({'found': true, 'book': dbResult[0]}))
        }
    });
});

function fetchUserRequests(email, callback) {
    
    var bookInstances = db.get('book_instance');
    var users = db.get('users');
    
    users.findOne({'email':email}, function(err, user) {
        if (err) console.log(err);

        // found user..
        if (user != undefined) {
            bookInstances.find({'transaction.buyer._id':user._id}, function(err, instances) {
                 if (err) console.log(err);

                 // found book instances for user ....
                 if (instances.length != 0) {
                     var userRequests = [];
                     
                     // build list of book_ids
                     for (var i = 0; i < instances.length; i++) {
                         if (instances[i].book != undefined) {
                             
                             userRequests.push(instances[i]);
                         }
                     }
                     
                     callback(userRequests);
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

function fetchUserBooks(email, callback) {
    var bookInstances = db.get('book_instance');
    var users = db.get('users');

    users.findOne({'email':email}, function(err, user) {
        if (err) console.log(err);

        // found user..
        if (user != undefined) {
            bookInstances.find({'user_id':user._id}, function(err, instances) {
                 if (err) console.log(err);

                 // found book instances for user ....
                 if (instances.length != 0) {
                     var userBooks = [];
                     var userRequests = [];
                     
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
