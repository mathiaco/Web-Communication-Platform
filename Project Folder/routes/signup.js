var express = require('express');
var router = express.Router();

/*
    Signup page is no longer in use
 */
//Handles POST requests sent to signup
router.post('/signup',function(req,res){
    if(req.body.psw == req.body.psw2) {
        res.send('You sent:\<br>Email: ' + req.body.email + '\<br>Password: ' + req.body.psw
        + '\<br>Password2: ' + req.body.psw2 + '\<br>Remember: ' + req.body.remember);
    } else {
        res.send('Your password didn\'t match')
    }
});

router.get('/signup', function(req, res) {
    res.render('signup.ejs', {});
});

module.exports = router;