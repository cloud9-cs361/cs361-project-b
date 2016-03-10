var express = require('express');
var router = express.Router();
var app = require('../app');
var db = app.dbo;

router.get('/', function(req, res, next){
    var context = {};
    
    var bookInstances = db.get('book_instance');
    bookInstances.findOne({'book_id': req.body.bookid}, function(err, instance){
      if (err) console.log(err);
      
      context.book = instance;
    });
    res.render('purchase', context);
});

module.exports = router;