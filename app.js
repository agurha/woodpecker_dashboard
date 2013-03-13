
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


// Passport session setup.
// To support persistent login sessions .. Passport needs to be able to serialize users into sessions and deserialize out
// of the session

passport.serializeUser(function(user, done){
  done(null, user.id);
});


passport.deserializeUser(function(id, none){

  // Put logic here
});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 1333);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());

  app.use(express.session({
    secret : config.session.secret,
    store : new RedisStore({
      host : config.redis.host,
      port : config.redis.port,
      pass : config.redis.password,
      prefix : config.redis.prefix
    })
  }));

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));




});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/privacy', routes.privacy);
app.get('/terms', routes.terms);

app.get('/pricing', routes.pricing);
app.get('/docs', routes.docs);
app.get('/login', routes.login);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
