/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 21/03/2013
 * Time: 17:00
 * To change this template use File | Settings | File Templates.
 */
var nodemailer = require('nodemailer');

var auth_email = "agurha@gmail.com"
  , auth_password = "samsung";

var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: auth_email,
    pass: auth_password
  }
});

exports.smtpTransport = smtpTransport;
