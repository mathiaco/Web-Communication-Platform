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


module.exports = router;
