var express = require('express');
var router = express.Router();
var fs = require ('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});


router.post('/username',function(req,res){
    res.render('username', { username: req.body.username});
    fs.writeFileSync('user.json','"'+req.body.username+'"')
});


module.exports = router;
