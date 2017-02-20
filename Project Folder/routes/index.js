var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  //TODO: Adjust index page
  //IF LOGGED IN -> render INDEX
  if(false) {
    res.render('index.ejs', {});
  }
  //IF NOT LOGGED IN -> render Login page
  else {
    res.render('login.ejs', {});
  }
});


router.get('/dashboard', function(req, res) {
  res.render('dashboard.ejs', {});
});
router.get('/groups', function(req, res) {
  res.render('groups.ejs', {});
});
router.get('/grouppage', function(req, res) {
  res.render('grouppage.ejs', {});
});

router.get('/classes', function(req, res) {
  res.render('classes.ejs', {});
});

router.get('/classpage', function(req, res) {
  res.render('classpage.ejs', {});
});

module.exports = router;
