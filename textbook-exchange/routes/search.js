var express = require('express');
var router = express.Router();

/* GET search page. */
router.get('/', function(req, res, next) {
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
    
    
    books.find({'title':req.body.searchKeyword}, function(err, books) {
        if (err) console.log(err);
        
        // found user..
        if (books.length != 0) {
            for (var book in books) {
                bookInstances.find({'book_id':book._id}, function(err, instances) {
                if (err) console.log(err);
                 
                // found book instances for user ....
                if (instances.length != 0) {
                    var book_ids = [];
                    // build list of book_ids
                    for (var i = 0; i < instances.length; i++) {
                        book_ids.push(instances[i].book_id);
                    }
                    books.find({
                        '_id': { $in: book_ids } 
                    }, function(err, book) {
                        if (err) console.log(err);
                        userBooks.push(book);
                    });
                 }
            });
                
            }
        }
    });
    
    context.name = name;
    context.email = email;
    context.userbooks = userbooks;
    
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
    console.log("heasdfsadfre");
    var errors = validateSearch(req.body.searchKeyword,req.body.zipCode);
    
    if (errors.length == 0) {
        res.render('search');
        /* Pull Matching Results from the Database*/
    }
    else{
        res.render('search', {errors: errors});
    }
    
});


module.exports = router;
module.exports.validateSearch = validateSearch;