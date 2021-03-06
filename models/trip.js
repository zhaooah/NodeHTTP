var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt-nodejs');

var ObjectId = mongoose.Schema.ObjectId;
var id = mongoose.Types.ObjectId();


var Trip = new Schema({
    id: ObjectId,
    tripName: String,
    start: String,
    end:String,
    candidateHotels : { type : Array , "default" : [] },
    hotels : { type : Array , "default" : [] },
    buddies : [ {type : mongoose.Schema.ObjectId, ref : 'Account'} ]
});


module.exports = mongoose.model('Trip', Trip);