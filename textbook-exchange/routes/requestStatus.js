var express = require('express');
var router = express.Router();
var app = require('../app');
var db = app.dbo;

router.get('/', function(req, res, next){

    //Find the Book and User(Book Instance)
    var book_requested = req.session.object_id;
    
    var request_status = "PENDING";
    
    getUser(req.session.email, function(buyer) {
        /*Insert Trade Request with buyer_id, book_instance, status*/
        insertRequest(book_requested, buyer, request_status, function(err) {
            if (err == null || err.length == 0) {
                res.redirect('profile');
            }
            else {
                res.render('requestStatus', {errors: err});
            }
      
        });
    });
  
});

function setTransaction(bookInstance, buyer, status) {
    var transaction = {
        'buyer':buyer,
        'status':status
    }
    bookInstance.transaction = transaction;
    
}


/*Add the book to the User's Requested Books*/
function insertRequest(book_requested, buyer, request_status, callback) {
    var bookInstances = db.get('book_instance');
    var error = [];

    var new_transaction = {
        'buyer':buyer,
        'status':request_status
    }
    bookInstances.findOne({'_id':book_requested}, function(err, bookInstance){
        if (err) console.log(err.message);
        if ((bookInstance.transaction == undefined || bookInstance.transaction.status == "OPEN") && (bookInstance.user_id != buyer._id)) {
            bookInstances.findAndModify(
              {
                'query': {_id: book_requested}, // query
                'update': {$set: 
                    {transaction: new_transaction}}, // replacement, replaces only the field "hi"
              'options': {'new': true}, // options
              },
              function(err, updatedInstance) {
                  if (err){
                      console.warn(err.message);  // returns error if no matching object found
                  }
                  else{
                      console.log("Transaction created for %s:%s", updatedInstance.book.isbn, updatedInstance.book.title);
                      callback(null);
                  }
              });
        }
        else {
            console.log("Book is already pending or closed or you are trying to buy your own book. Action cannot be completed");
            error.push("Book is already pending or closed or you are trying to buy your own book. Action cannot be completed");
            callback(err);
        }
    });
};


function getUser(email, callback) {
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

module.exports = router;