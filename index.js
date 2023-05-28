require("dotenv").config();
const express = require('express');
const swaggerUi = require("swagger-ui-express");
const { security } = require('./middlewares');
const routes = require('./routes');
const Response = require('./helpers/response');

const { swagger } = require("./configs");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
app.use(security);

app.use('', routes);
app.use((err, req, res, next) => {
    return Response.serverError("Internal server error", res, err);
  });

app.listen(port, () => {
  console.log(
  `Auth service is running on http://localhost:${port}/api-docs`
  );
}); 


module.exports = app;