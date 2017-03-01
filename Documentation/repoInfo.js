var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');

/* GET profile page. */
router.get('/', function(req, res, next) {
    res.render('templates/repoInfo', { title: 'RepoInfo'});
});



module.exports = router;

