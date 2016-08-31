var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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
    clientID: 'APP_ID-HERE',
    clientSecret: 'CLIENT_SECRET_HERE',
    // Make sure that the name you give your callback matches the callback on the server.
    callbackURL: "http://localhost:8080/auth/facebook/callback"
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
            return cb(null, newUser);  
          })
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