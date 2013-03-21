
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title:'Home', user: req.user});
};

exports.about = function(req,res){
  res.render('about', {title: 'About'});
}

exports.privacy = function(req,res){
  res.render('privacy', {title: 'Privacy'});
}

exports.terms = function(req,res){
  res.render('terms', {title: 'Terms'});
}

exports.pricing = function(req,res){
  res.render('pricing', {title: 'Pricing'});
}

exports.docs = function(req,res){
  res.render('docs', {title: 'Docs'});
}

//Login get
exports.login = function(req,res){
  res.render('login', {title:'Login', user:req.user, message:req.session.messages });
}

//Login post
exports.login_post = function(req,res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
}


