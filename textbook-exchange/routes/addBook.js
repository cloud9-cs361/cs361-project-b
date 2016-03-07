var express = require('express');
var router = express.Router();

/*Check the user has input all info for the book*/
function validateBookInfo(isbn,title,author,edition){
    var errors = [];
    
    // ISBN validation
    if (isbn == undefined || isbn.length == 0) {
        errors.push('ISBN is required.');
    }
    
    // Title validation
    if (title == undefined || title.length == 0) {
        errors.push('Title is required.');
    }
    
    // Author validation
    if (author == undefined || author.length == 0) {
        errors.push('Author is required.');
    }
    
    // Edition validation
    if (edition == undefined || edition.length == 0) {
        errors.push('Edition is required.');
    }
    
    return errors;
};


/* GET add book form */
router.get('/', function(req, res, next){
    res.render('addBook');
});

//Submit Book Info into Database
router.post('/',function(req,res){
    var errors = validateBookInfo(req.body.isbn,req.body.title,req.body.author,req.body.edition);
    
    if (errors.length == 0) {
        res.redirect('/profile');
        /* Upload to database and Redirect back to Profile*/
      
    }else{
        res.render('addBook', {errors: errors});
    }
    
});

module.exports = router;
module.exports.validateBookInfo = validateBookInfo;