var path = require('path');
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('Cookie Monster!'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use("/public",express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
    app.use(express.errorHandler());
});

//Routes
require('./routes')(app);

app.listen(app.get('port'), function(){
  console.log(("Let us go! Port at " + app.get('port')))
});



//SocketIO
var client = require('socket.io').listen(3000).sockets;
var mongo = require('mongodb').MongoClient;

mongo.connect('mongodb://heroku_app30064365:d0unhulra37196o0ljv5md5t97@ds039850.mongolab.com:39850/heroku_app30064365',function(err,db) {
	if(err) throw err;

	client.on('connection',function(socket){
		
		var col= db.collection('messages');
		var sendStatus = function(s){
			socket.emit('status', s);
		};

		//Emit all messages
		//Force this to all client that is open
		//every client is listening when a new message is inserted
		//we will not retrieve all the message again, we will only get the new message
		col.find().limit(100).sort({_id : 1}).toArray(function(err,res){
			if (err) throw err;
			socket.emit('output',res);
		});

		//Wait for input
		socket.on('input', function(data){
			var name = data.name,
				message = data.message,
				whitespacePattern=/^\s*$/;

				if(whitespacePattern.test(name)||whitespacePattern.test(message)){
					sendStatus('Name and message is required.');
				}	
				else{
					col.insert({name:name, message:message},function(){
						//Emit latest message to All clients
						client.emit('output',[data])

						sendStatus({
							message:"Message sent",
							clear: true
						});
						// console.log('Inserted');
					});

				}
		});
	});
 });




//Passport JS 
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


//Mongoose
mongoose.connect('mongodb://heroku_app30064365:d0unhulra37196o0ljv5md5t97@ds039850.mongolab.com:39850/heroku_app30064365');










