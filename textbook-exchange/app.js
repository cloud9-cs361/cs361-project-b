var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var db = require('monk')('localhost/bookr');
app.db = db;
app.set('db', db);
/* use dbo in routes with:
      var app = require('../app');
      var db = app.dbo;
*/
exports.dbo = db;

// set up routes
var index = require('./routes/index');
var users = require('./routes/users');
var profile = require('./routes/profile');
var createAccount = require('./routes/createAccount');
var login = require('./routes/login');
var logout = require('./routes/logout');
var addBook = require('./routes/addBook');
var search = require('./routes/search');
var purchase = require('./routes/purchase');
var requestStatus = require('./routes/requestStatus');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
  // @jens testing resave=true to see if it fixes sessions expiring too early
  resave: true,
  saveUninitialized: false,
  secret: 'textbookr'
}));

// attach route files at desired paths
app.use('/', index);
app.use('/createaccount', createAccount);
app.use('/profile', profile);
app.use('/login', login);
app.use('/logout', logout);
app.use('/addbook', addBook);
app.use('/search', search);
app.use('/purchase', purchase);
app.use('/requeststatus', requestStatus);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;