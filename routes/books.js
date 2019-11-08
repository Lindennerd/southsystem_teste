const express = require("express");
const shortId = require("shortid");

const db = require("../database");

const router = express.Router();

router.get("/", function(req, res, next) {
  const books = db.get("books");
  res.json(books);
});

router.post("/", function(req, res, next) {
  try {
    const book = req.params;

    console.log(req.params);

    book.id = shortId.generate();
    db.get("books").push(book).write();
    res.status(200).send();
  } catch {
    res.status(500).send("Error");
  }
});

module.exports = router;
