var express = require('express');
var router = express.Router();
var connectEnsureLogin = require('connect-ensure-login');
var gitInfo = require('../modules/gitInfo');

/* GET home page. */
router.get('/', function (req, res) {
  //TODO: Adjust index page
  //IF LOGGED IN -> render INDEX
  if (req.user) {
          //Gets the user profile before rendering the page
          gitInfo.getGitProfileByID(req.user, function(res1) {
              var profile = res1;
              gitInfo.getGitReposByID(req.user, function (repoData) {
                  res.render('profile', {
                      id: req.user,
                      profile: profile,
                      repos: repoData
                  });

              });
          });
  }
  //IF NOT LOGGED IN -> render Login page
  else {
    res.render('login.ejs', {});
  }
});

/*
  Handle the routing for the rest of the pages
 */

//When a GET request is sent to /dashboard
router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  //render the "dashboad.ejs" view
  res.render('dashboard.ejs', {});
});
router.get('/groups', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  res.render('groups.ejs', {});
});
router.get('/grouppage', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  res.render('grouppage.ejs', {});
});

router.get('/classes', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  res.render('classes.ejs', {
    userID: req.user
  });
});

router.get('/classpage', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  res.render('classpage.ejs', {
    userID: req.user
  });
});

router.get('/postpage', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  // send userID to postpage.ejs
  res.render('postpage.ejs', {
    userID: req.user
  });
});
router.get('/chat', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  res.render('chat.ejs', {
    userID: req.user
  });
});
router.get('/channels', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  res.render('channels.ejs', {
    userID: req.user
  });
});

module.exports = router;
