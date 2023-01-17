const express = require('express');
const { security } = require('./middlewares');
const routes = require('./routes');
const Response = require('./helpers/response');
const swaggerUi = require("swagger-ui-express");
const { swagger } = require('./configs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swagger));
app.use(security);


app.use('', routes);
app.use((err, req, res, next) => {
    return Response.serverError("Internal server error", res, err);
  });

  

module.exports = app;