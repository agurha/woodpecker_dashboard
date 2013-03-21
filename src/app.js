/**
 * Module dependencies.
 */

var express = require('express')
  , config = require('config')

  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , RedisStore = require("connect-redis")(express)
  , flash = require('connect-flash')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('./models/user').User;


// Passport session setup.
// To support persistent login sessions .. Passport needs to be able to serialize users into sessions and deserialize out
// of the session
passport.serializeUser(function (user, done) {
  var createAccessToken = function () {
    var token = user.generateRandomToken();
    User.findOne({ accessToken: token }, function (err, existingUser) {
      if (err) {
        return done(err);
      }
      if (existingUser) {
        createAccessToken(); // Run the function again - the token has to be unique!
      } else {
        user.set('accessToken', token);
        user.save(function (err) {
          if (err) return done(err);
          return done(null, user.get('accessToken'));
        })
      }
    });
  };

  if (user._id) {
    createAccessToken();
  }
});

passport.deserializeUser(function (token, done) {
  User.findOne({accessToken: token}, function (err, user) {
    done(err, user);
  });

});

passport.use(new LocalStrategy(function (email, password, done) {
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, { message: 'Unknown user with email :' + email });
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) return done(err);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || config.node.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());

  app.use(express.session({
    secret: config.session.secret,
    store: new RedisStore({
      host: config.redis.host,
      port: config.redis.port,
      pass: config.redis.password,
      prefix: config.redis.prefix
    })
  }));

  // Remember Me middleware
  app.use(function (req, res, next) {
    if (req.method == 'POST' && req.url == '/login') {
      if (req.body.rememberme) {
        req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
      } else {
        req.session.cookie.expires = false;
      }
    }
    next();
  });

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/privacy', routes.privacy);
app.get('/terms', routes.terms);

app.get('/pricing', routes.pricing);
app.get('/docs', routes.docs);

// signup get router
app.get('/signup', function (req, res) {
  res.render('signup', { title: 'signup'});

});

// signup post router
app.post('/signup', function (req, res, next) {

  console.log(req);

  var usr = new User({ email: req.body.email, password: req.body.password });
  User.findOne({username: usr.username}, function (err, data) {
    if (err) return next(err);
    if (data) {
      res.send('Oops, this username has been taken. Please try another one.');
    } else {
      usr.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/login');
      })
    }

  });
});

app.get('/login', function (req, res) {
    res.render('login', { title: 'Login', user: req.user, message: req.session.messages});
  }
);

// login post router
app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      req.session.messages = [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// account logout router
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

// Status check middleware. Check if confirmation email has send before
// note that the data will be expired in 1.5h, so the user can only be send another email after 1.5h
// If there's no record in the database, then create a new recoad for the emailStatus
function checkStatus(req, res, next) {
  Activation.findOne({ email: req.body.email }, function (err, data) {
    if (err) {
      return next(err);
    } else if (data === null) {
      return( next() );
    } else if (data.verifyStatus === true) {
      res.send('Your account has already been activated. Just head to the login page.');
    } else {
      res.send('An email has been send before, please check your mail to activate your account. Note that you can only get another mail after 1.5h. Thanks!');
    }
  });
}

