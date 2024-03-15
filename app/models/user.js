const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
	name: { type: String, required: true},  
	username: { type: String, required: true, unique: true },
	password: { type: String}, 
},{  timestamps: true});


userSchema.plugin(passportLocalMongoose);

//creating usermodel to take instance to access userSchema
const User = mongoose.model('User', userSchema);
module.exports = User;

