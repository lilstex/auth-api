const db = require("./db");
const swagger = require("./swagger");
const transporter = require("./env");

module.exports = {
  db: db,
  swagger: swagger,
  transporter: transporter
};
