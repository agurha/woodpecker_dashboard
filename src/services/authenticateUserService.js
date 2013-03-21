/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 07/03/2013
 * Time: 13:29
 * To change this template use File | Settings | File Templates.
 */

var api = require('./apiService').apiClient;

exports.authenticateUser = function(email, password, cb) {


  var userObj = {
    email : email,
    password : password
  }

  api.post('/user/authenticate', userObj , function(err, user){

    if(err)
      cb(err, null);

    else
      cb(null, user);
  });

}