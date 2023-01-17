const { Router } = require('express');
const authRoutes = require('./auth');
const roomRoutes = require('./room');
const Response = require('../helpers/response');

const routes = Router();

routes.use("/api/user", authRoutes);
routes.use("/api/room", roomRoutes);

routes.use((_, res) => {
    Response.notFoundResponse('Route not found', res);
});

module.exports = routes;