var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Session stuff
var passport = require('passport');
var session = require('express-session');

//Json file
var testAuth = require('./json/test.json');

// Database
//Firebase
var firebase = require('firebase-admin');
var serviceAccount = require("./json/serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://group3db-f028e.firebaseio.com"
"
});
var db = firebase.database();
//Routes
var index = require('./routes/index.js');
var signup = require('./routes/signup.js');
var login = require('./routes/login.js');
var callback = require('./routes/callback.js');
var gitauth = require('./routes/gitauth.js');



var app = express();

//Global Vars should be initialized like this
app.locals.count = 0;

// view engine setup
app.set('views', path.join(__dirname, 'website/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//session middleware (Session stuff)
app.use(session({
  secret: 'da',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


/*
  Handling GET and POST requests by the using the appropriate routes.
 */

//The index route handles most of the simple routing.
app.use('/', index);
app.get('/login', login);
app.post('/login',login);
app.get('/auth/callback', callback);
app.post('/auth/callback', callback);
app.get('/auth/github', gitauth);

//How it renders the pages simplified:
//app.get('/test', express.Router().get('/test',function(req,res){res.render('test')}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
