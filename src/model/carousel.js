const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema({
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

const Carousel = mongoose.model("Carousel", carouselSchema);
module.exports = Carousel;
