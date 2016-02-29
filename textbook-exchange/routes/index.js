var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  var user = {
    fullName: "dummyuser" 
  }
  
  res.render('index', {user: user});
});

router.get('/logout', function(req, res, next) {
  res.redirect('/');
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
});

router.post('/', function(request, response) {
    
});

module.exports = router;
