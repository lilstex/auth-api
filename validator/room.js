const Joi = require("joi");

module.exports = {
    createRoom: {
        roomNumber: Joi.number().required(),
        floorNumber: Joi.number().required(),
        roomPrice: Joi.number().required(),
        roomSize: Joi.string().required().valid("small", "medium", "big"),
        roomStatus: Joi.boolean().default(false),
        },
};
