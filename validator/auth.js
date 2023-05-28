const Joi = require("joi");

module.exports = {
  accountRegistration: {
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  },

  login: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },

  sendPasswordResetCode: {
    email: Joi.string().email().required(),
  },

  validatePasswordResetCode: {
    email: Joi.string().email().required(),
    passwordCode: Joi.number().required(),
  },

  updateAccount: {
    authId: Joi.string().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
  },

  updatePassword: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },

  assignRole: {
    userId: Joi.string().required(),
    role: Joi.string().required().valid("admin", "user"),
  },
  
};
