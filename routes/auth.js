const express = require('express');
const db = require("../database");
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const secret = require('../secret');

const router = express.Router();

router.post('/', function(req, res, next) {
  const user = req.body;
  const foundUser = db
  	.get('users')
  	.find({userEmail: user.userEmail})
  	.value();

  if(!foundUser){
  	res.status(401).send('user not found');
  } else {
	  if(md5(user.userPassword) === foundUser.userPassword) {
	  	const token = jwt.sign({id: user.id}, secret.key);
      foundUser.token = token;
	  	res.status(200).send(foundUser);
	  } else {
	  	res.status(401).send('invalid user');
	  }	
  } 

});

module.exports = router;