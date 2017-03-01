var express = require('express');
var router = express.Router();
var https = require('https');
var request = require('request');
var fs = require('fs');

var username = require('../user.json');

var requestLogin = {
    url: "https://api.github.com/users/" + username,
    method: 'GET',
    headers: {
        'User-Agent': username
    }
};

request(requestLogin, function (error, response, body) {
 fs.writeFileSync(username+".json", body);
});


var profileData = require('./'+username+'.json');

/* GET profile page. */
router.get('/', function(req, res, next) {
    res.render('templates/profile', {title: profileData
    });
});

module.exports = router;

