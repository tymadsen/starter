var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.user == undefined)
    res.redirect('/users/login');
  else
  	res.render('index', { title: 'Express' });
});

module.exports = router;
