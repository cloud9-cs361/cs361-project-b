var express = require('express');
var router = express.Router();

/* GET search page. */
router.get('/', function(req, res, next) {
    res.render('search', context);
});

/*Check the user has input search terms*/
function validateSearch(searchKeyword,zipCode){
    var errors = [];
    
    // searchKeyword validation
    if (searchKeyword == undefined || searchKeyword.length == 0) {
        errors.push('Search Terms are required.');
    }
    
    // ZipCode validation
    if (zipCode != undefined && zipCode.length != 5) {
        errors.push('Zipcode is required.');
    }
    
    return errors;
};



/*Retrieve Matching Search Results*/
/*function fetchMatchISBN(searchKeyword){
    var bookInstances = db.get('book_instance');
    var users = db.get('users');
    var books = db.get('book');
    
    books.find({'isbn':searchKeyword}, function(){

            
    });
    
}*/



/*Search for the Book or Report Error to User*/
router.post('/',function(req,res){
    var name = req.session.name;
    var email = req.session.email;
    var zip = req.session.zip;
    
    var errors = validateSearch(req.body.searchKeyword,zip);
    //console.log(errors);
    if (errors.length == 0) {
        
        var context = {};
        
        var db = req.app.get('db');
        var name = req.session.name;
        var email = req.session.email;
        
        
        var bookInstances = db.get('book_instance');
        var users = db.get('users');
        var books = db.get('book');
        
        var searchKeyword = req.body.searchKeyword;
        var zipCode = req.body.zipCode;
        var userBooks = [];
        books.find({'title': {$regex: req.body.searchKeyword}}, function(err, books) {
            if (err) console.log(err);
            if (books.length != 0) {
                var bookids = [];
                for (var book in books) {
                    bookids.push(book._id)
                }
                bookInstances.find({'book_id': {"$in": bookids}}, function(err, instances) {
                    if (err) console.log(err);
                     
                    if (instances.length != 0) {
                        for (var instance in instances) {
                        var userbook = {};
                        users.find({'user_id':instance.user_id}, function(err,userbookuser) {
                            if (err) console.log(err);
                            userbook.user = userbookuser[0];
                        });
                        books.find({'book_id':instance.book_id}, function(err,userbookbook) {
                            if (err) console.log(err);
                            userbook.book = userbookbook[0];
                        });
                        userBooks.push(userbook)
                        }
                    }
                });
                    
            }
        });
        
        context.name = name;
        context.email = email;
        context.userbooks = userBooks;
        res.render('search', context);
        /* Pull Matching Results from the Database*/
    }
    else{
        res.render('search', {errors: errors});
    }
    
});


module.exports = router;
module.exports.validateSearch = validateSearch;