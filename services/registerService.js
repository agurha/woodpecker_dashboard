/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 07/03/2013
 * Time: 13:22
 * To change this template use File | Settings | File Templates.
 */

var logger = require('./loggerService').logger;
var api = require('./apiService').apiClient;

exports.registerUser = function(email, password, cb) {

  var userObj = {

    email : email,
    password : password
  };

  api.post('/user/register', userObj, function(err, user){

    if(err)
      return cb(err, null)

    else {

      return cb(null, user);
    }

  });
}