var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var context = {};
  if (!req.session.name){
    res.render('index');
  }
  else {
    context.name = req.session.name;
    res.render('index', context);
  }
});

module.exports = router;
