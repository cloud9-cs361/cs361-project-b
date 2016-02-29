var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('create account');
});

router.post('/', function(request, response) {
    console.log(request.body);
});

module.exports.validateAccountCreation = function(name, username, password, password2, zip) {
  
};

module.exports = router;
