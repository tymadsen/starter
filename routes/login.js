var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {title:'Sign In', css:['bootstrap/bootstrap.min', 'bootstrap/signin'], base_url:"localhost:3000"});
});

module.exports = router;
