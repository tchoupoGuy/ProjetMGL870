"use strict";

var express = require('express');

var jwt = require('express-jwt');

var userRoutes = express.Router();
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload',
  algorithms: ['HS256']
});

var multer = require('multer');

var mkdirp = require('mkdirp');

var bodyParser = require('body-parser');

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    var dir = './public/images/logo';
    mkdirp(dir, function (err) {
      return cb(err, dir);
    });
  },
  filename: function filename(req, file, cb) {
    cb(null, new Date().getTime() + "-" + file.originalname);
  }
});
var upload = multer({
  storage: storage
});
ctrUserAutentification = require('../controllers/authentication');
ctrUser = require('../controllers/userControllers');
ctrProfile = require('../controllers/profile');
userRoutes.route('/login').post(ctrUserAutentification.login);
userRoutes.route('/profile').get(auth, ctrProfile.profileRead);
userRoutes.route('/getUserById/:id').get(ctrUser.getUserById);
userRoutes.route('/addUser').post(ctrUserAutentification.register);
userRoutes.route('/reset').post(ctrUserAutentification.reset);
userRoutes.route('/telExist/:tel').get(ctrUser.telExist);
userRoutes.route('/Autoriser/:id').get(ctrUser.Autoriser);
userRoutes.route('/RevoqueAutoriser/:id').get(ctrUser.RevoqueAutoriser);
userRoutes.route('/updateUser/:id').put(ctrUser.updateUser);
userRoutes.route('/validation/:id').put(ctrUser.updateUserValidation);
userRoutes.route('/existEmail/:email').get(ctrUser.emailExist);
userRoutes.route('/emailOrTelExist/:value').get(ctrUser.emailOrTelExist);
userRoutes.route('/CommandeByFournisseur').get(ctrUser.CommandeByFournisseur);
userRoutes.route('/allUsers').get(ctrUser.allUsers);
userRoutes.route('/allUsersD').get(ctrUser.allUsersD);
userRoutes.route('/allUsersF').get(ctrUser.allUsersF);
userRoutes.route('/updatePassword/:id').put(ctrUser.updatePassword);
userRoutes.route('/setRamdom/:tel').get(ctrUser.setRamdom);
userRoutes.route('/logo').post(upload.single('file'), function (req, res) {
  console.log('Je suis la', req.file);

  if (req.file) {
    return res.json("".concat(req.file.path));
  } else {
    return res.json("");
  }
});
module.exports = userRoutes;