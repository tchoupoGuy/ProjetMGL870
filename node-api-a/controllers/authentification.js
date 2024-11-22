var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('Utilisateur');
var Distributeur = mongoose.model('Utilisateur');
var LocalStrategy = require('passport-local').Strategy;
const logger = require('../config/logger');
// const dotenv = require("dotenv");

module.exports.register = function (req, res) {
  var user = new Distributeur();
  var generator = require('generate-password');
  user.name = req.body.name;
  user.email = req.body.email;
  user.tel = req.body.tel;
  user.password = req.body.password;
  var password = user.password;
  user.setPassword(password);
  user.save();

  if (user) {
    logger.info(`User with: ${email} register successful`);
    return res.status(200).json(user);
  } else {
    logger.error(`Erreur with status: ${res.status} ...`);
    return res.status(404).send(new Error('Erreur 404...'));
  }
};
module.exports.login = function (req, res) {
  username = req.body.email;
  password = req.body.password;

  Distributeur.findOne(
    { $or: [{ tel: username }, { email: { $eq: username } }] },
    function (err, user) {
      if (err) {
        res.status(404).json(err);
        logger.error(`Email ${email} not found...`);
        return;
      }
      // Return if user not found in database
      if (!user) {
        // return new Error('úser not dound');
        logger.error(`User with this ${email} does'nt exist`);
        return res.json(false);
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        logger.error(`invalid password`);
        return res.json(false);
      }
      // If credentials are correct, return the user object
      if (user) {
        var token;
        token = user.generateJwt();
        // console.log('TOKEN:', token);
        res.status(200);
        res.json({
          token: token,
        });
        process.env.MY_SECRET = token;
        logger.info(`User with this ${email} connection success`);
      } else {
        return res.json(false);
      }
      //  return res.status(200).json(user)
    }
  );
};
