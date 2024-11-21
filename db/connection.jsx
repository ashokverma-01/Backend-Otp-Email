const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Password-Reset")
  .then(() => {
    console.log("MongoDb connection successfully");
  })
  .catch((e) => {
    console.log(e);
  });
