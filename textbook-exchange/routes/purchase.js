var express = require('express');
var router = express.Router();
var app = require('../app');
var db = app.dbo;

router.get('/object_id=:object_id', function(req, res, next){
    var object_id = req.params.object_id;

    //Save book instance(object id) to session
    req.session.object_id = object_id;
    
    var context = {};
    //console.log(bookid);
    fetchBook(object_id, function(instance){
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