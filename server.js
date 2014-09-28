var path = require('path');
var http = require('http');
var express = require('express');
    app = module.exports.app = express();
var server = http.createServer(app);
var http = require('http');
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
var socketdotio = require('socket.io');
//var io = socketdotio.listen(server), username_ios = {};
var io = socketdotio.listen(80), username_ios = {};
//io.configure(function () { 
 // io.set("transports", ["xhr-polling"]); 
 // io.set("polling duration", 20); 
//});
io.sockets.on('connection', function (socket) {
  socket.on('user message', function (msg) {
    socket.broadcast.emit('user message', socket.username_io, msg);
  });




  socket.on('username_io', function (nick, fn) {
    if (username_ios[nick]) {
      fn(true);
    } else {
      fn(false);
      username_ios[nick] = socket.username_io = nick;
      socket.broadcast.emit('Broadcast', nick + ' is online now.');
      io.sockets.emit('username_ios', username_ios);
    }
  });

  socket.on('disconnect', function () {
    if (!socket.username_io) return;

    delete username_ios[socket.username_io];
    socket.broadcast.emit('Broadcast', socket.username_io + ' just went off online.');
    socket.broadcast.emit('username_ios', username_ios);
  });
});



//Passport JS 
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


//Mongoose
mongoose.connect('mongodb://heroku_app30064365:d0unhulra37196o0ljv5md5t97@ds039850.mongolab.com:39850/heroku_app30064365');










