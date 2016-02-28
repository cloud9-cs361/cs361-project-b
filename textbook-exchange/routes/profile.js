var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'bookr' });
});