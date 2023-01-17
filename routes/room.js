const { Router } = require('express');
const room = require('../controllers/room');
const { validate } = require("../middlewares");
const validator = require("../validator/room");

const routes = Router();

routes.post(
    "/create-room", 
    validate(validator.createRoom), 
    room.createRoom
);

module.exports = routes;