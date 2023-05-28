const { Router } = require('express');
const authRoutes = require('./auth');
const Response = require('../helpers/response');

const routes = Router();

routes.use("", authRoutes);

routes.use((_, res) => {
    Response.notFoundResponse('Route not found', res);
});

module.exports = routes;