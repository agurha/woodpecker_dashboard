
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
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

exports.login = function(req,res){
  res.render('login', {title:'Login'});
}


