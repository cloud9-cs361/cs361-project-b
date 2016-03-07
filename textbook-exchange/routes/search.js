var express = require('express');
var router = express.Router();


/*Check the user has input search terms*/
function validateSearch(searchKeyword,zipCode){
    var errors = [];
    
    // searchKeyword validation
    if (searchKeyword == undefined || searchKeyword.length == 0) {
        errors.push('Search Terms are required.');
    }
    
    // ZipCode validation
    if (zipCode == undefined || zipCode.length == 0) {
        errors.push('Zipcode is required.');
    }
    
    return errors;
};

/*Search for the Book or Report Error to User*/
router.post('/',function(req,res){
    var errors = validateSearch(req.body.searchKeyword,req.body.zipCode);
    
    if (errors.length == 0) {
        res.redirect('/search');
        /* Pull Matching Results from the Database*/
        
    }
    else{
        res.render('search', {errors: errors});
    }
    
});


module.exports = router;
module.exports.validateSearch = validateSearch;