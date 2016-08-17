var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


var User = mongoose.model('User');


router.post('/postingExample', auth, function(req, res, next){
	res.json(req.body);
});

router.post('/signup', function(req, res, next){
  console.log('inside of post signup', req.body)
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
// Create new instance of user
  var user = new User();
// Add username
  user.username = req.body.username;
// has the users pasword
  user.hashPassword(req.body.password)
// save changes to the database
  user.save(function (err){
    
    if(err){ return next(err); }
    // Respond to the user with token
   res.json({token: user.generateJWT()})
  });

});

router.post('/login', function(req, res, next){
  console.log('inside of post for login', req.body)
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
// Authenticate using password
  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
