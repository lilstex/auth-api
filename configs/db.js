const mongoose = require("mongoose");
require("dotenv").config();
(async () => {
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>console.log("DB Connection Successful!"));
})();

module.exports = { mongoose };
