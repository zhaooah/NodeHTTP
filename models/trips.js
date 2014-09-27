var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt-nodejs');

var ObjectId = require('mongoose').Schema.ObjectId;


var Trip = new Schema({
    id: ObjectId,
    name: String,
    buddies : [ {type : mongoose.Schema.ObjectId, ref : 'Account'} ]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);