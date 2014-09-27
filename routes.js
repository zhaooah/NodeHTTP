var passport = require('passport');
var Account = require('./models/account');

module.exports = function (app) {
    
  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.get('/trips', function(req, res) {
      res.render('trips', { });
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
