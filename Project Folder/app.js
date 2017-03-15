var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//
var firebase = require('firebase-admin');
var serviceAccount = require('./config/serviceAccountKey.json');
var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var config = require('./config/config.js');
var connectEnsureLogin = require('connect-ensure-login');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: config.firebase.databaseURL
});
var db = firebase.database();

//Routes
var index = require('./routes/index.js');
var login = require('./routes/login.js');


//PASSPORT
// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
      clientID: config.github.client_id,
      clientSecret: config.github.client_secret,
      callbackURL: config.github.redirect_uri
    },
    function(accessToken, refreshToken, profile, cb) {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      var usersRef = db.ref('users');
      usersRef.child(profile.id).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        if (exists) {
          console.log('user ' + profile.id + ' exists!');
          return cb(null, profile.id);
        } else {
          console.log('user ' + profile.id + ' does not exist!');

          //CREATE PROFILE IN DB
          db.ref('users/' + profile.id).set({
            username: profile.username,
            access_token: accessToken
          });
          return cb(null, profile.id);
        }
      });
    }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.

//The Profile.id is is serialized as "user". Can be accessed by req.user.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(id, cb) {
  console.log("DESERIALIZE: " + id);
  cb(null, id);
});

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
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


/*
  Handling GET and POST requests by the using the appropriate routes.
 */

//The index route handles most of the simple routing.
app.use('/', index);
app.get('/login', login);
app.post('/login',login);
app.get('/auth/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });
app.get('/auth/github', passport.authenticate('github'));
app.get('/profile',
    connectEnsureLogin.ensureLoggedIn(),
    function(req, res){
      res.render('profile', { id: req.user });
    });

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
