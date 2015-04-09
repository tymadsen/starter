var express = require('express');
var router = express.Router();
var password_hash = require('password-hash');
// var cookie_parser = require("cookie-parser");
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
  var message = "";
  var css = ['bootstrap/bootstrap.min', 'bootstrap/signin'];
  var js = [];
  if(req.cookies.message != undefined)
    message = req.cookies.message;
  res.render('login', {title:'Sign In', message:message, route:'existing', css:css, js:js, base_url:base_url});
});
/* GET signup page. */
router.get('/signup', function(req, res, next) {
  var message = "";
  var css = ['bootstrap/bootstrap.min', 'bootstrap/signin'];
  var js = ['password_validator'];
  if(req.cookies.message != undefined)
    message = req.cookies.message;
  res.render('signup', {title:'Create Account', message:message, route:'new', css:css, js:js, base_url:base_url});
});
/* POST new user. */
router.post('/new', function(req, res) {
  //Hash PW
  var hashed_pw = password_hash.generate(req.body.password, {iterations:iterations});
  var message = "";
  var path = "/users/login";
  
  //Check if user exists boefore adding
  mongo_client.connect(url, function(err, db){
    assert.equal(null, err);
    // console.log(err);
    console.log("Connected correctly to server");
    // console.log(res);

    userExists(db, req.body.username, function(exists){
      console.log(exists);
      if(exists){
        //User already exists
        message = "User already exists";
        path = "/users/signup";
        console.log(path);
        db.close();
      }else{
        //add to the db
        var data = {firstname:'',lastname:'',username:req.body.username,
          email:req.body.username,password:hashed_pw};
        insertDocuments(db, data, function(results){
          message = "Account created successfully";
          db.close();
        });
      }
      // console.log(path);
      res.cookie('message', message, {maxAge:4000, httpOnly:true});
      res.redirect(path);
    });
  });
  //render signup/login screen
});
/* POST login. */
router.post('/existing', function(req, res) {
  var message = "";
  //Check if user exists before adding
  mongo_client.connect(url, function(err, db){
    assert.equal(null, err);
    // console.log(err);
    console.log("Connected correctly to server");
    // var users = db.collection('users');
    login(db, {email:req.body.username}, req.body.password, function(status, message, cookie){
      if(status){//user exists -- session data set
        //render dashboard
        console.log(cookie);
        db.close();
        res.cookie('message', message, {maxAge:4000, httpOnly:true});
        res.cookie('user', cookie, {maxAge:900000, httpOnly:true});
        res.redirect('/dashboard/');
      }else{//user does not exist
        db.close(); 
        res.cookie('message', message, {maxAge:4000, httpOnly:true});
        res.redirect("/users/login/");
      }
      console.log(message);
    });
  });
});

module.exports = router;

var findDocuments = function(db, find, callback, col){
  find = typeof find == 'object' ? find : {};
  col = typeof col == 'string' ? col : "users";
  var collection = db.collection(col);
  collection.find(find).toArray(function(err, docs){
    assert.equal(null,err);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

var userExists = function(db, username, callback, col){
  username = typeof username == 'string' ? username : '';
  col = typeof col == 'string' ? col : 'users';
  var find = {username:username};
  var collection = db.collection(col);
  console.log(find);
  collection.find(find).count(function(err, count){
    assert.equal(null,err);
    console.log("User "+username+" already exists");
    console.log(count);
    callback(count>0);

  });
}

var insertDocuments = function(db, records, callback, col){
  records = typeof records == 'object' ? records : {};
  col = typeof col == 'string' ? col : "users";
  var collection = db.collection(col);
  collection.insert(records, function(err, results){
    assert.equal(null,err);
    console.log("Added user successfully");
    callback(results);
  });
}

var login = function(db, find, pw, callback, col){
  find = typeof find == 'object' ? find : {};
  pw = typeof pw == 'string' ? pw : '';
  col = typeof col == 'string' ? col : "users";
  var collection = db.collection(col);
  var message = "";
  var status = null;
  var cookie = {};
  collection.find(find).toArray(function(err, docs){
    assert.equal(null,err);
    if(docs.length == 0){
      message = "User does not exist";
      status = false;
    }else if(password_hash.verify(pw, docs[0].password)){//login
      //set session data
      var user = docs[0];
      cookie = {
        id:user._id, 
        username:user.username, 
        email:user.email, 
        firstname:user.firstname, 
        lastname:user.lastname
      }, {maxAge:900000, httpOnly:true};
      message = "Login successful";
      console.log(message);
      status = true;
    }else{//incorrect password
      status = false;
      message = "Incorrect username or password";
    }
    callback(status, message, cookie);
  });
}