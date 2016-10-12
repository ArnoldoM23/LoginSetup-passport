var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
// Use passport LocalStrategy
passport.use(new LocalStrategy(function(username, password, done) {
  // Find user in database
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // validate password
      if (!user.validatePassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// This for using the facebook strategy
passport.use(new FacebookStrategy({
    clientID: '334626160209344',
    clientSecret: 'f9eed647008c5b6495f56bc70951ae21',
    // Make sure that the name you give your callback matches the callback on the server.
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function(){
      // look for user in the database.
      User.findOne({facebook_id: profile.id}, function(err, user){
        console.log('user', user)
        if(err){ return cb(err)}
        if (user) {
          return cb(null, user)
        } else{
          
          var newUser = new User();
          newUser.facebook_id = profile.id;
          newUser.name = profile.displayName;
          newUser.username = profile.displayName.split(' ')[0];

          newUser.save(function(err){
            if (err) { throw err } 
          })
          cb(null, newUser); 
        }
      });
    });
  }
));
// serialize the data
passport.serializeUser(function(user, cb) {
  console.log('serializeUser',user);
  cb(null, user);
});
// deserialize the data
passport.deserializeUser(function(user, cb) {
  console.log('deserializeUser',user);
  cb(null, user);
});


passport.use(new GitHubStrategy({
    clientID: "1ed2cefa7eb57736b397",
    clientSecret: 'a5e0323fb2b8242898a869cb4369a4ff2b10cad9',
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));