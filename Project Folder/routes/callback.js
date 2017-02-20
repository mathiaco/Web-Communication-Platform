var express = require('express');
var router = express.Router();


var request = require('request');
var testAuth = require('../json/test.json');
//var githubAPI = require('github');


var CLIENT_ID = testAuth['client_id'];
var CLIENT_SECRET = testAuth['client_secret'];
var REDIRECT_URL = testAuth['redirect_uri'];
var STATE = testAuth['state'];
var ACCESS_TOKEN;


//Handles POST requests sent to signup
router.post('/auth/callback',function(req,res){
    res.send('post to callback');
});

//Gets the Code Parameter sent from github and sends a post request to get an access_token.
router.get('/auth/callback', function(req, res) {
    //checks if state matches
    if(req.query.state == testAuth['state']) {
        var session_code = req.query.code;
        var options = {
            url: "https://github.com/login/oauth/access_token",
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            form: {
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "redirect_uri": REDIRECT_URL,
                "code": session_code,
                "state": STATE
            }
        };
        //response is named res1 so that it doesn't interfere
        request(options, function postResponse(error, res1, body) {
            if (!error && res1.statusCode == 200) {
                ACCESS_TOKEN = JSON.parse(body).access_token;
                console.log('access_token: ' + ACCESS_TOKEN);
                console.log("Logged in");
                res.redirect('/dashboard');
            } else {
                console.error(error);
            }
        });

    }
    else {
        res.send('No state provided');
    }
});



module.exports = router;