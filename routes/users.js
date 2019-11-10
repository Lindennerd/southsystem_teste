var express = require('express');
const shortId = require("shortid");
const md5 = require('md5');

const db = require("../database");

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	const users = db.get('users');
  res.json(users);
});

router.post("/", function (req, res, next) {
  try {
    const user = req.body;
    user.userPassword = md5(user.userPassword);
    
    user.id = shortId.generate();
    db.get("users")
      .push(user)
      .write();

    res.status(200).send();
  } catch (e) {
    res.status(500).send("Error");
  }
});

router.put("/", function (req, res, next) {
  try {
    const user = req.body;
    db.get('users')
      .find({ id: user.id })
      .assign(user)
      .write();

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
    throw e;
  }
});

router.delete('/', function (req, res, next) {
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
