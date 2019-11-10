const jwt = require('jsonwebtoken');
const db = require("../database");
const secret = require('../secret');

const auth = async(req, res, next) => {
	const user = req.header('Authorization');
	console.log(user);
	const data = jwt.verify(user.token, secret.key);

	if(data) {
		res.status(401).send('not authorized request');
	} else {
		next();
	}
}

module.exports = auth;