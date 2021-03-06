var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt-nodejs');

var ObjectId = require('mongoose').Schema.ObjectId;

var Account = new Schema({
    id: ObjectId,
    username: String,
    password: String,
    email: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);