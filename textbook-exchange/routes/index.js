var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /** TESTING CODE HERE SINCE DON"T NEED SESSION **/
  var db = req.app.get('db');
  var email = "jensbodal@gmail.com";
  /*
  testFunction(db, email, function(val) {
    console.log("@jens Value: %s", val);
  });
  */
  
  var context = {};
  if (!req.session.name){
    res.render('index');
  }
  else {
    context.name = req.session.name;
    res.render('index', context);
  }
});

function testFunction(db, email, callback) {
  var users = db.get('users');
  var book_instances = db.get('book_instance');
  var books = db.get('book');
  
  users.find({'email':email}, function(err, user) {
    if (err) console.log(err);
    if (user.length != 0) {
      var user_id = user[0]._id;
      book_instances.find({'user_id':user_id}).forEach(
        function(instance) {
          books.find({'_id':instance.book_id}).forEach(
            function(book) {
              console.log(book);
            });
        }
      );
    }
  });
  callback(email);
  
}

/*router.get('/login', function(req, res, next) {
  var user = {
    fullName: "dummyuser" 
  }
  res.render('index', {user: user, title: 'bookr'});

});

router.get('/logout', function(req, res, next) {
  res.redirect('/');
});

router.post('/', function(request, response) {
    
});*/

module.exports = router;
