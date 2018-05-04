const mongoose = require("mongoose");

// create jargon schema
const jargonSchema = mongoose.Schema({
  id: Number,
  jargon: String,
  explanation: String
});

//compile jargon schema into a model
const Jargon = mongoose.model("Jargon", jargonSchema);

module.exports = Jargon;
