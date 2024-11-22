//var User = require('../models/User');
var User = require('../models/Utilisateur');
require('dotenv').config();
var stripe = require('stripe')

const apiKey ='pk_test_51Q1yhoQHJrpVHtr3afeghhDji3SuFGhtG4luIl7oW2VRh3LjY4guFupinTmcjRPux8LUyw2F2eOi1rG5fdg8YGeH00gtoJLYou'
const secretKey ='sk_test_51Q1yhoQHJrpVHtr3S1XQ5MrQWjLTzZcaEuCQvIOkwHU8pNGC6IzifUheGPVWQAKede3xgLXdgxEwJwreF1rGHzBa00it6cYF1E'

//stripe.setApiKey(apiKey, secretKey)



  module.exports.payement = async function(req, res){
    console.log("barry");
    try{
        const paymentIntent = stripe.createPaymentIntent({
            amount: 1000,
            currency: 'USD',
            customer: customerId,
          })
          
          paymentIntent.then(function(response) {
            // The payment has been created successfully.
          })
          
          .catch(function(error) {
            // There was an error processing the payment.
          })

    }catch(err){
        return res.status(500).send(new Error('Erreur 500...'));
    }
}

module.exports.allUsers = async function(req, res){
    console.log("barry");
    try{
        let users = await User.find({}).sort({"createdAt": -1});
        console.log("distributeur",users);
        if(!users){
            return res.status(404).send(new Error('Érror 404 data note found...'));
        }else{
            return res.status(200).json(users);
        }

    }catch(err){
        return res.status(500).send(new Error('Erreur 500...'));
    }
}
