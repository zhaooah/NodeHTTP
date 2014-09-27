var passport = require('passport');
var Account = require('./models/account');
var Trip = require('./models/trip');
var mongoose = require('mongoose');
var request = require('request')



module.exports = function (app) {
    
  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  //Trips CRUD

  app.get('/trips', function(req, res) {

     Trip.find({}, function (err, docs) {
      res.render('trips/index.jade', { 
        trips: docs,
        user : req.user 
      });
  });



  });

  app.get('/trips/new', function(req, res){
  res.render('trips/new.jade', { 
    user : req.user
  });
});

app.post('/trips/new', function(req, res){

  trip = new Trip({
    tripName:req.body.tripName,
    id:mongoose.Types.ObjectId()  });
  

    trip.save(function (err){
    if (!err) {
      res.redirect('/trips');
    }
    else {
      req.flash('warning', err);
      res.redirect('/trips/new');
    }
  });
});


app.post('/getHotelData', function(req, res){

        backURL=req.header('Referer') || '/';

  var checkindate=req.body.checkin
  var checkoutdate=req.body.checkout
  var city=req.body.city
  var RequestPath='http://www.priceline.com/svcs/ac/index/hotels/opqsearch/'
  var ResultPath=RequestPath.concat(city)
//For RESTful API call
    console.log(req.body.city)
    console.log(ResultPath);


 var HotelZones;
 
  request(ResultPath, function (error, response, body) {

      console.log(error);
      console.log(response);
     // console.log(body);


    if (!error && response.statusCode == 200) {
      //console.log(body)
      var HotelZones=JSON.parse(body).region.zones;

    res.render('trips/zones.jade', { 
            zones:  HotelZones,
            backRoute:backURL
    });

    }


})





});


  app.put('/trips/:id', function(req, res){
  trip.findById(req.params.id, function (err, doc){
    doc.updated_at = new Date();
    doc.trip = req.body.trip.trip;
    doc.save(function(err) {
      if (!err){
        req.flash('info', 'trip udpated');
        res.redirect('/trips');
      }
      else {
        // error handling
      }
    });
  });
});

// Delete
app.del('/trips/:id', function(req, res){
  trip.findOne({ _id: req.params.id }, function(err, doc) {
    if (!doc) return next(new NotFound('Document not found'));
    doc.remove(function() {
      req.flash('info', 'trip deleted');
      res.redirect('/trips');
    });
  });
});


  app.get('/trips/:id', function(req, res){
  

  Trip.findById(req.params.id, function (err, doc){


    res.render('trips/show.jade', { 
            trip: doc 
    });
  });

});


  app.post('/register', function(req, res) {
      Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
          if (err) {
            return res.render("register", {info: "Oops, let us try another username..."});
          }

          passport.authenticate('local')(req, res, function () {
            res.redirect('back');    
          });
      });
  });

  app.get('/login', function(req, res) {
      backURL=req.header('Referer') || '/';

      res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect(backURL);
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  
};
