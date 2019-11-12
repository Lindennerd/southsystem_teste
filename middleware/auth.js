const jwt = require('jsonwebtoken');
const secret = require('../secret');

const auth = async(req, res, next) => {
	const token = req.header('Authentication');
	if(!token) {
		res.status(401).send('not authorized request');	
	} else {
		const data = jwt.verify(token, secret.key);
		
		if(!data) {
			res.status(401).send('not authorized request');
		} else {
			next();
		}
	}

}

module.exports = auth;