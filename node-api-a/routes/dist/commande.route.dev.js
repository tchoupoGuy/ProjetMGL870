"use strict";

var express = require('express');

var jwt = require('express-jwt');

var commandeRoutes = express.Router();
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload',
  algorithms: ['HS256']
});
commandeCotrollers = require('../controllers/commandeControllers');
paypalControllers = require('../controllers/paypalController');
commandeRoutes.route('/paypalTransaction').post(auth, paypalControllers.paypalTransaction);
commandeRoutes.route('/paypalAutorisation').post(auth, paypalControllers.paypalAutorisation);
commandeRoutes.route('/addCommande').post(auth, commandeCotrollers.addCommande);
commandeRoutes.route('/attenteCommande').get(auth, commandeCotrollers.listeCommande);
commandeRoutes.route('/livrerCommande/:id').get(auth, commandeCotrollers.livrerCommande);
commandeRoutes.route('/listeCommandeAttente').get(auth, commandeCotrollers.listeCommandeAttente);
commandeRoutes.route('/listeCommandeTraite').get(auth, commandeCotrollers.listeCommandeTraite);
commandeRoutes.route('/listeCommandeFournisseur').get(auth, commandeCotrollers.listeCommandeFournisseur);
commandeRoutes.route('/listeCommandeFourniTraite').get(auth, commandeCotrollers.listeCommandeFourniTraite);
commandeRoutes.route('/listeCommandeFourni').get(auth, commandeCotrollers.listeCommandeFourni);
commandeRoutes.route('/AllCommandeAttente').get(auth, commandeCotrollers.AllCommandeAttente);
commandeRoutes.route('/AllCommandeTraite').get(auth, commandeCotrollers.AllCommandeTraite);
commandeRoutes.route('/AllCommandeFournisseur').get(auth, commandeCotrollers.AllCommandeFournisseur);
commandeRoutes.route('/listeCommande').get(auth, commandeCotrollers.listeCommande);
commandeRoutes.route('/getCommandeById/:id').get(auth, commandeCotrollers.getCommandeById);
commandeRoutes.route('/deleteCommande/:id').get(auth, commandeCotrollers.deleteCommande);
commandeRoutes.route('/cancelCommande/:id').get(auth, commandeCotrollers.cancelCommande);
commandeRoutes.route('/revoqueCommande/:id/:id_user').get(auth, commandeCotrollers.revoqueCommandes);
commandeRoutes.route('/relationCommandes/:id/:id_commande').get(auth, commandeCotrollers.relationCommandes);
commandeRoutes.route('/relationCommande/:id/:id_commande').get(auth, commandeCotrollers.relationCommande); //commandeRoutes.route('/livraisonCommandeFournisseur/:id/:id_user').get(auth,commandeCotrollers.livraisonCommandeFournisseur);

commandeRoutes.route('/livraisonCommandeFournisseur').post(auth, commandeCotrollers.livraisonCommandeFournisseur);
commandeRoutes.route('/paypal/:id').get(auth, commandeCotrollers.paypal);
commandeRoutes.route('/livraisonCommande/:id').get(auth, commandeCotrollers.livraisonCommande);
commandeRoutes.route('/livraisonCommandes/:id/:id_user').get(auth, commandeCotrollers.livraisonCommandes);
commandeRoutes.route('/ViewRelation/:id/').get(auth, commandeCotrollers.ViewRelation);
module.exports = commandeRoutes;