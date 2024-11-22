"use strict";

var express = require('express');

var jwt = require('express-jwt');

var besoinRoutes = express.Router();
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload',
  algorithms: ['HS256']
});
besoinCtr = require('../controllers/besoinControllers');
besoinRoutes.route('/addNotification').post(besoinCtr.addNotification);
besoinRoutes.route('/getNotification').get(besoinCtr.getNotification);
besoinRoutes.route('/addBesoin').post(auth, besoinCtr.addBesoin);
besoinRoutes.route('/PayementOM/:id').get(auth, besoinCtr.OrangeMoney);
besoinRoutes.route('/getBesoinLourd').get(auth, besoinCtr.getBesoinLourd);
besoinRoutes.route('/besoinsAll').get(auth, besoinCtr.besoinsAll);
besoinRoutes.route('/testRequete').get(auth, besoinCtr.testRequete);
besoinRoutes.route('/getBesoinLeger').get(auth, besoinCtr.getBesoinLeger);
besoinRoutes.route('/getBesoinMachine').get(auth, besoinCtr.getBesoinMachine);
besoinRoutes.route('/besoinClientStatus').get(auth, besoinCtr.besoinClientStatus);
besoinRoutes.route('/getBesoinsEncoursForAdmin').get(besoinCtr.getBesoinsEncoursForAdmin);
besoinRoutes.route('/getBesoinLourdById/:_id').get(auth, besoinCtr.getBesoinLourdById);
besoinRoutes.route('/deleteBesoin/:id').get(auth, besoinCtr.deleteBesoin);
besoinRoutes.route('/updateBesoinMachine/:id').put(auth, besoinCtr.updateBesoinMachine);
besoinRoutes.route('/getBesoinAndClientById/:id').get(auth, besoinCtr.getBesoinAndClientById);
besoinRoutes.route('/updateBesoinLeger/:id').put(auth, besoinCtr.updateBesoinLeger);
besoinRoutes.route('/updateBesoin/:id').put(auth, besoinCtr.updateBesoin);
besoinRoutes.route('/traitementEngin/:idFlotte/:idRelatiion').get(auth, besoinCtr.traitementEngin);
module.exports = besoinRoutes;