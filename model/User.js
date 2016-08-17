var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// ccreate user schema
var UserSchema = mongoose.Schema({
	username: {type:String, unique: true},
	password: String,
	salt: String
});

UserSchema.methods.hashPassword = function(password){
	// Create the salt
	this.salt = crypto.randomBytes(16).toString('hex');
	// Store the new password 
  this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validatePassword = function(password){
	// Hash the current password 
	var currentPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	// check is the current password matches the users password
	return this.password === currentPassword;
};

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