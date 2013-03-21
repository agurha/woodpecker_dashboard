/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 07/03/2013
 * Time: 11:04
 * To change this template use File | Settings | File Templates.
 */

var config = require('config');
var restify = require('restify');
var logger = require('./loggerService').logger;

apiClient = restify.createJsonClient({

  url : config.api.url,
  version : config.api.version,
  log : logger
});


exports.apiClient = apiClient;