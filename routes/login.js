var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {title:'Sign In', css:['test','test2']});
});

module.exports = router;
