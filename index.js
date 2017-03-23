var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require ('fs');
var GitHubApi = require("github");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});


function getProfileByID(id){
    var github = new GitHubApi({
        // optional
        debug: true,
        protocol: "https",
        host: "api.github.com", // should be api.github.com for GitHub
        pathPrefix: "", // for some GHEs; none for GitHub
        headers: {
            "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
        },
        Promise: require('bluebird'),
        followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
        timeout: 5000
    });
    github.users.getById({
        // optional
        // headers: {
        //     "cookie": "blahblah"
        // },
        id: id

    }, function(err, res) {
        fs.writeFileSync(id + ".json", JSON.stringify(res));
        fs.writeFileSync('user.json',res.login);
        getProfile(res.login);
        getRepo(res.login);
    });
}

// Get username  and collect its data
router.post('/username',function(req,res){
    res.render('username', { username: req.body.username});
    fs.writeFileSync('user.json',req.body.username);
    getProfile(req.body.username);
    getRepo(req.body.username);
});

// Get id and collect data
router.post('/ID',function(req,res){
    res.render('ID', { userID: req.body.userID});
     getProfileByID(req.body.userID);
});

function getUsername(){
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

    res.render('templates/profile', {title: getProfileData(),
        data: getRepoData(),
        user: getUsername()
    });
});

function getProfile(username) {

    var requestLogin = {
        url: "https://api.github.com/users/" + username,
        method: 'GET',
        headers: {
            'User-Agent': username
        }
    };

    //Profile info is retrieved as "body"
    request(requestLogin, function (error, response, body) {
        fs.writeFileSync(username+".json", body);

    });

}

function getRepo(username) {
    var requestRepo = {
        url: "https://api.github.com/users/" + username + "/repos",
        method: 'GET',
        headers: {
            'User-Agent': username
        }
    };

    //Repo info is retrieved as "body"
    request(requestRepo, function (error, response, body) {
        fs.writeFileSync(username+"Repos.json", body);
    });
}


// function getContributors(user, itemName) {
//     var requestContributors = {
//         url: "https://api.github.com/repos/" + user + "/" + itemName + "contributors",
//         method: 'GET',
//         headers: {
//             'User-Agent': username
//         }
//     };
//
//     request(requestLogin, function (error, response, body) {
//         fs.writeFileSync(username+".json", body);
//
//     });
// };

module.exports = router;
