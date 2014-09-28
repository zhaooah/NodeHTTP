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
        console.log(docs);

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
        res.render('trips/gettingstarted.jade', { 
            backID: trip.id});

    }
    else {
      req.flash('warning', err);
      res.redirect('/trips/new');
    }
  });
});






app.post('/doneWithSelection', function(req, res){

  backURL=req.header('Referer') || '/';


  //Let us insert data
  var cityName=req.body.city;
  var start=req.body.checkin;
  var end=req.body.checkout;
  var room=req.body.room;
  var min=req.body.MinimumPrice;
  var max=req.body.MaximumPrice;
  var TripId=req.body.backKey;


  var RequestPath='http://www.priceline.com/api/hotelretail/listing/v3/'.concat(cityName).concat('/').concat(start).concat('/').concat(end).concat('/').concat(room).concat('/100?offset=0');
 
  request(RequestPath, function (error, response, body) {

      console.log(error);
     // console.log(response);
     // console.log(body);
   

    if (!error && response.statusCode == 200) {
      //console.log(body)
      var Hotels=JSON.parse(body).hotels;
      var HotelList=JSON.parse(body).hmiSorted;
//      var it = Iterator(HotelList);
  //    for (var hotel in it)
    //    console.log(hotel);

            Trip.update({_id:TripId },
         { 'start':start,'end':end},{upsert:true}, function(err, data) { 
});

  var ImageRequestPath='http://www.priceline.com/api/hotelretail/listing/v3/'.concat(cityName).concat('/').concat(start).concat('/').concat(end).concat('/').concat(room).concat('/100?offset=0');



      for(var i = 0; i < HotelList.length;i++){
          var HotelIndex=HotelList[i];
          var HotelPrice=Hotels[HotelIndex].merchPrice;

         // console.log(max);
        if (HotelPrice<=parseInt(max,10) || HotelPrice>=parseInt(min,10)){
          console.log(Hotels[HotelIndex].hotelName);
            Trip.update({_id:TripId },
         {$push: { 'candidateHotels' : Hotels[HotelIndex] }},{upsert:true}, function(err, data) { 
});

        }
        //console.log(Hotels[HotelIndex].hotelName);

        


      }

          res.render('trips/show.jade', { 
            tripID:TripId
        });


      //Render the webpage here


//      console.log(Trip.findById(TripId, function (err, hotels) {}));





    }




});




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

/*
    try {
     console.log('Error here!');

    }
    catch(err) {
                res.render('trips/gettingstarted.jade', { 
              trip: doc,
            backID: req.params.id});
    }
*/



    res.render('trips/show.jade', { 
            trip: doc,
            backID: req.params.id
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
