const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// ------from heroku website: https://devcenter.heroku.com/articles/nodejs-mongoose

// find an appropriate database to connect to, or default to localhost if we don't find one.
var uristring = process.env.MONGODB_URI || "mongodb://localhost/jargonstein-db";

// create express server instance
const app = express();

// set up middleware / routes
let jargon = require("./routes/jargon");
app.use("/jargon", jargon);

// listen on port defined in process.env.PORT or default to 5000

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server started on port ${port} ...`);

// Connect to database...
// makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function(err, res) {
  if (err) {
    console.log("ERROR connecting to: " + uristring + ". " + err);
  } else {
    console.log("Succeeded connecting to: " + uristring);
  }
});

// now that db is successfully connected, import Jargon model and initialise the
// db by importing seed-data from jargonList. before initialising, however, clear db of all previous records.
const Jargon = require("./models/jargon-model");
const jargonList = require("./models/jargonListSeedData");

// initialise document count constant
const NO_OF_DOCUMENTS = [];

// collection.remove() is async.
// so first clear collection of existing documents, the use callback for
// collection.insert()
Jargon.remove({}, function(err) {
  console.log("Previous collection removed");

  // then insert fresh set of documents into collection
  Jargon.collection.insert(jargonList, function(err, docs) {
    if (err) {
      return console.error(err);
    } else {
      console.log(`Collection initialised with ${docs.insertedCount} records`);
      NO_OF_DOCUMENTS[0] = docs.insertedCount;
    }
  });
});

// naming this module export 'count' because it returns the count of documents in a collection
// NO_OF_DOCUMENTS required by jargon.js to generate randomn number for document retrieval
module.exports.count = function getDocumentCount() {
  return NO_OF_DOCUMENTS;
};
