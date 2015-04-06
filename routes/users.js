var express = require('express');
var router = express.Router();
var password_hash = require('password-hash');
var mongodb = require('mongodb');
var mongo_client = mongodb.MongoClient;
var assert = require('assert');
var base_url = "localhost:3000";
var iterations = 10;
var url = "mongodb://localhost:27017/starter";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/* GET login page. */
router.get('/login', function(req, res, next) {
  console.log(mongodb);
  console.log('space');
  console.log(mongo_client);
  res.render('login', {title:'Sign In', route:'existing', css:['bootstrap/bootstrap.min', 'bootstrap/signin'], base_url:base_url});
});
/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', {title:'Create Account', route:'new', css:['bootstrap/bootstrap.min', 'bootstrap/signin'], js:['password_validator', 'jquery.min'], base_url:base_url});
});
/* POST new user. */
router.post('/new', function(req, res) {
	console.log(req.body);
  //Hash PW
  var hashed_pw = password_hash.generate(req.body.password, {iterations:iterations});
  // console.log(hashed_pw);
  // res.send("Congrats! Your new password has been hashed: "+hashed_pw);
  // console.log(password_hash.verify(req.body.password, hashed_pw));
  
  //Check if user exists boefore adding
  mongo_client.connect(url, function(err, db){
    assert.equal(null, err);
    console.log(err);
    console.log("Connected correctly to server");
    // var users = db.collection('users');
    findDocuments(db, {email:req.body.username}, function(docs){
      if(docs.length > 0){
        //User already exists
        console.log("User already exists")
        db.close();
      }else{
        //add to the db
        var data = {firstname:'',lastname:'',username:req.body.username,
        email:req.body.username,password:hashed_pw};
        insertDocuments(db, data, function(results){
          db.close();
        });
      }
    });
  });
  //render signup screen
  res.render('signup', {title:'Create Account', route:'new', css:['bootstrap/bootstrap.min', 'bootstrap/signin'], js:['password_validator', 'jquery.min'], base_url:base_url});
  //render login screen
  // res.render('login', {title:'Sign In', route:'existing', css:['bootstrap/bootstrap.min', 'bootstrap/signin'], base_url:base_url});
});
/* POST login. */
router.post('/existing', function(req, res) {
  // res.render('signup', {title:'Create Account', route:'new', css:['bootstrap/bootstrap.min', 'bootstrap/signin'], js:['password_validator', 'jquery.min'], base_url:base_url});
});

module.exports = router;

var findDocuments = function(db, find, callback, collection){
  find = typeof find == 'object' ? find : {};
  collection = typeof collection == 'String' ? collection : "users";
  var collection = db.collection(collection);
  collection.find(find).toArray(function(err, docs){
    assert.equal(null,err);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

var insertDocuments = function(db, records, callback, collection){
  records = typeof records == 'object' ? records : {};
  collection = typeof collection == 'String' ? collection : "users";
  var collection = db.collection(collection);
  collection.insert(records, function(err, results){
    assert.equal(null,err);
    console.log("Added user successfully");
    callback(results);
  });
}