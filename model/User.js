var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// ccreate user schema
var UserSchema = mongoose.Schema({
	username: {type:String, unique: false},
	password: String,
	salt: String,
	// you can modified the User model to include more of the facebook properties if you like
	name: String,
	facebook_id: String
});
// For hashing the password.
UserSchema.methods.hashPassword = function(password){
	// Create the salt
	this.salt = crypto.randomBytes(16).toString('hex');
	// Store the new password 
  this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};
// Validate the password
UserSchema.methods.validatePassword = function(password){
	// Hash the current password 
	var currentPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	// check is the current password matches the users password
	return this.password === currentPassword;
};
// Create a token
UserSchema.methods.generateJWT = function() {
  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
// Create and return the token
  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

mongoose.model('User', UserSchema);