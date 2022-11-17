const mongoose = require("mongoose");

const NewItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
  picture: {
    type: String,
    required: false,
  },
});

const Item = mongoose.model("Item", NewItemSchema);

module.exports = Item;
