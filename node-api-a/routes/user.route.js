const express = require('express');                                     
var jwt = require('express-jwt');                                       
const userRoutes = express.Router();                                    
var auth = jwt({                                                        
  secret: 'MY_SECRET',                                                  
  userProperty: 'payload',                                              
  algorithms: ['HS256']                                                 
});                                                                     
                                                                                                                                                                                                                                                                       
ctrUserAutentification = require('../controllers/authentification');                                                                    
      
ctrUsers = require('../controllers/userController');                    
                    
//Route for get user
userRoutes.route('/allUsers').get(ctrUsers.allUsers);

//Route for login
userRoutes.route('/login').post(ctrUserAutentification.login);

//Route for add user
userRoutes.route('/addUser').post(ctrUserAutentification.register);

module.exports = userRoutes;
