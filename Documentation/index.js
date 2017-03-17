var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require ('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

// Get username  amd collect its data
router.post('/username',function(req,res){
    res.render('username', { username: req.body.username});
    fs.writeFileSync('user.json',req.body.username);
    getProfile(req.body.username);
    getRepo(req.body.username);
});

function getUsername(){

    console.log("Actual user:" + fs.readFileSync('user.json'));
    var username= fs.readFileSync('user.json');
    return username;
}

function getProfileData(){
    return require('../'+getUsername()+'.json');
}

function getRepoData(){
  return  require('../'+getUsername()+'Repos.json');
}


/* GET profile page. */
router.get('/profile', function(req, res, next) {

    res.render('templates/profile', {title: getProfileData()
    });
});

/* GET repo page. */
router.get('/repo', function(req, res, next) {

    res.render('templates/repo', { title: getRepoData(),
        user: getUsername()
    });
});

function getProfile(username) {
    console.log("getting profile for "+ username);

    var requestLogin = {
        url: "https://api.github.com/users/" + username,
        method: 'GET',
        headers: {
            'User-Agent': username
        }
    };

    request(requestLogin, function (error, response, body) {
        fs.writeFileSync(username+".json", body);
        console.log("getProfile accessed !");

    });


}


function getRepo(username) {
    console.log("getting Repo for "+ username);
    var requestRepo = {
        url: "https://api.github.com/users/" + username + "/repos",
        method: 'GET',
        headers: {
            'User-Agent': username
        }
    };

    request(requestRepo, function (error, response, body) {
        fs.writeFileSync(username+"Repos.json", body);
        console.log("getRepo Accessed!")
    });
}
module.exports = router;
