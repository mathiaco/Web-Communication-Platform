var express = require('express');
var router = express.Router();

var testAuth = require('../json/test.json');

var CLIENT_ID = testAuth['client_id'];
var REDIRECT_URL = testAuth['redirect_uri'];
var STATE = testAuth['state'];

/*
    This page redirects the browser to the github website for authorization.
    It will send a client_id, redirect_url and a state (a secret string)
 */
router.get('/auth/github', function(req, res) {
    res.redirect('https://github.com/login/oauth/authorize' + '?client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URL + '&state=' + STATE);
});

module.exports = router;