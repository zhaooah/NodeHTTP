var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt-nodejs');

var ObjectId = mongoose.Schema.ObjectId;
var id = mongoose.Types.ObjectId();


var Hotel = new Schema({
    id: ObjectId,
    hotelName: String,
    start: String,
    end:String,
    pricelineID:Number
});


module.exports = mongoose.model('Hotel', Hotel);