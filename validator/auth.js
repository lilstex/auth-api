const Joi = require("joi");

module.exports = {
  accountRegistration: {
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    accountType: Joi.string()
      .required()
      .valid("customer", "admin", "staff"),
  },

  login: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },

  verifyAccount: {
    authId: Joi.string().required(),
    emailCode: Joi.number(),
    phoneNumberCode: Joi.number(),
    verificationMethod: Joi.string().required().valid("email", "phoneNumber"),
  },

  resendVerificationCode: {
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
    verificationMethod: Joi.string().required().valid("email", "phoneNumber"),
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
    role: Joi.string().required().valid("manager", "operator", "guest"),
  },
  
};
