const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/webapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection successful");
  })
  .catch(() => {
    console.log("something wrong", error);
  });
