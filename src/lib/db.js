/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 21/03/2013
 * Time: 15:06
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('mongodb')
  , mongoose = require('mongoose');

var dbUrl = "localhost"
  , dbName = "woodpecker";

mongoose.connect(dbUrl, dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

exports.mongoose = mongoose;