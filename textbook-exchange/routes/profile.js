var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {
    var context = {};
    context.name = req.session.name;   // Get from objects
    // context.name = req.session.name = object.name  something like that
    context.email = req.session.email;
    res.render('profile', context);
});

module.exports = router;