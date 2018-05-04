const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Jargon = require("../models/jargon-model");

// require the server file(module) and save exported const into a const called collection
// so that calling collection.count() is descriptive
const collection = require("../server");
let uniqueIds = [];

router.get("/", (req, res) => {
  console.log("\nin router jargon");
  let documentCount = collection.count();

  console.log(`Total no. of documents in collection: ${documentCount}`);
  console.log(`uniqueIds contains ${uniqueIds}`);

  if (uniqueIds.length == documentCount) {
    // reinitialise uniqueIds to empty array
    uniqueIds = [];
  }
  
  let id = generateRandAndUniqueId(documentCount);
  console.log("To retrieve document with id", id);

  Jargon.findOne()
    .where("id")
    .equals(id)
    .select("jargon explanation")
    .exec(function(err, document) {
      if (err) return handleError(err);
      console.log(document.jargon);
      res.json(document);
    });
});

function generateRandAndUniqueId(documentCount) {
  let num;
  do {
    num = Math.floor(Math.random() * documentCount);
  } while (uniqueIds.includes(num));
  uniqueIds.push(num);
  return num;
}

module.exports = router;
