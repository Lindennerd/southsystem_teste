const express = require("express");
const shortId = require("shortid");
const secret = require('../secret');

const db = require("../database");

const router = express.Router();

router.get("/", function (req, res, next) {
  if(req.query) {
    const books = db.get('books').filter(req.query);
    res.json(books);
  } else {
    const books = db.get("books");
    res.json(books);    
  }
});

router.post("/",function (req, res, next) {
  try {
    const book = req.body;
    book.id = shortId.generate();
    db.get("books")
      .push(book)
      .write();

    res.status(200).send();
  } catch (e) {
    res.status(500).send("Error");
  }
});

router.put("/",function (req, res, next) {
  try {
    const book = req.body;
    db.get('books')
      .find({ id: book.id })
      .assign(book)
      .write();

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
    throw e;
  }
});

router.delete('/', function (req, res, next) {
  try {
    const bookId = req.body.id;
    db.get('books')
      .remove({ id: bookId })
      .write();

    res.status(200).send();   
  } catch (e) {
    res.status(500).send(e)
    throw e;
  }
});

module.exports = router;
