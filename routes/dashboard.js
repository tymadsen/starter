var express = require('express');
var assert = require('assert');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.user == undefined){
    res.redirect('/users/login');
  }else
    res.render('dash', {title: "Your Dashboard", css:['bootstrap/bootstrap.min', 'bootstrap/signin']});
});

module.exports = router;
