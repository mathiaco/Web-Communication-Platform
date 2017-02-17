var githubAPI = require('github');
var http = require('http');
var testAuth = require('.../json/test.json');

//github = client
/*
var github = new githubAPI({});

github.authorization.create({}, function(req, res){
    console.log(JSON.stringify(res));
    github.authenticate()
});

/*
 github.authenticate({
 type: "oauth",
 token: testAuth['token']
 },function(err, res){
 console.log(JSON.stringify(res));
 });


 github.misc.getRateLimit({}, function (err, res){
 console.log(JSON.stringify(res.resources.core.remaining));
 });

 github.repos.getAll({},function (err,res){
 console.log(JSON.stringify(res));
 });
 */

/*
 var token = github.authenticate({
 type: "oauth",
 key: "c92be8586ec53ff861be",
 secret: "ce6b2fd9306f30daa92cf99d8c6476c25604826d"
 }, function(err, res){
 console.log(JSON.stringify(res));
 });
 */