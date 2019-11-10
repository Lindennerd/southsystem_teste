var express = require('express');
const shortId = require("shortid");
const md5 = require('md5');

const auth = require('../middleware/auth');

const db = require("../database");

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	const users = db.get('users').forEach(user => {
    delete user.userPassword;
    return user;
  });
  res.json(users);
});

router.post("/", auth, function (req, res, next) {
  try {
    const user = req.body;
    user.userPassword = md5(user.userPassword);
    user.favoriteBooks = [];

    user.id = shortId.generate();
    db.get("users")
      .push(user)
      .write();

    res.status(200).send();
  } catch (e) {
    res.status(500).send("Error");
  }
});

router.put("/", auth, function (req, res, next) {
  try {
    const user = req.body;
    const dbUser = db.get('users')
      .find({id: user.id})
      .write();

    const userPassword = user.userPassword !== '' 
      && md5(user.userPassword) !== dbUser.userPassword
        ? dbUser.userPassword
        : md5(user.userPassword);

    db.get('users')
      .find({ id: user.id })
      .assign({
        userName: user.userName,
        userEmail: user.userEmail,
        id: dbUser.id,
        userPassword: userPassword,
        favoriteBooks: [...dbUser.favoriteBooks, ...user.favoriteBooks]
      })
      .write();

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
    throw e;
  }
});

router.delete('/', auth, function (req, res, next) {
  try {
    const userId = req.body.id;
    db.get('users')
      .remove({ id: userId })
      .write();

    res.status(200).send();   
  } catch (e) {
    res.status(500).send(e)
    throw e;
  }
});

module.exports = router;
