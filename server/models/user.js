var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
name: String,
email: {type: String, unique:true},
createdOn: Date,
modifiedOn: { type: Date, default: Date.now },
lastLogin: Date
});
// Build the User model




module.exports  = mongoose.model( 'User', userSchema );