var express = require('express');
var router = express.Router();
var app = require('../app');
var db = app.dbo;

router.get('/book_id=:book_id', function(req, res, next){
    var bookid = req.params.book_id;
    var context = {};
    //console.log(bookid);
    fetchBook(bookid, function(instance){
      context.instance = instance;
      //console.log(instance);
      res.render('purchase', context);
    });
});

function fetchBook(bookid, callback)
{
  var bookInstances = db.get('book_instance');
  //console.log(bookid);
  bookInstances.findOne({'_id':bookid}, function(err, instance){
    if (err) console.log(err);
    //console.log(instance);
    if (instance != undefined)
      callback(instance);
    else
      callback(null);
  });
}

module.exports = router;