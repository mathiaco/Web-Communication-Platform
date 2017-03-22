var githubAPI = require('github');
var github = new githubAPI({
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    headers: {
        "user-agent": "Soen341Group3" // GitHub is happy with a unique user agent
    },
    Promise: require('bluebird'),
    followRedirects: true, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});
var firebase = require('firebase-admin');
var serviceAccount = require('./../config/serviceAccountKey.json');
var config = require('./../config/config.js');

var db = firebase.database();

//Returns the user's github profile as JSON to the callback function
function getGitProfileByID(id, callback) {
    if(id) {
        github.users.getById({id: id}).then(function (res) {
            if(typeof callback === "function")
                callback(res);
        });
    }
}



module.exports.getGitProfileByID = getGitProfileByID;