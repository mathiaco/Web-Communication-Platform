var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
    res.render('login', {
        title: 'My Website'
    });
});

module.exports = router;