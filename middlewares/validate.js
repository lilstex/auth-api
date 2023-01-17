const Joi = require("joi");
const Response = require("../helpers/response");

module.exports = (obj) => {
  return async (req, res, next) => {
    const schema = Joi.object().keys(obj).required().unknown(false);
    const value = req.method === "GET" ? req.query : req.body;
    const { error, value: vars } = schema.validate(value);

    if (error) {
      return Response.validatorError(error.message, res);
      // return response(res, { status: false, message: error.message });
    }
    let publicData;

    if (req.authData) {
      publicData = {
        authId: req.authData._id,
        email: req.authData.email,   
        isEmailVerified: req.authData.isEmailVerified,
        phoneNumber: req.authData.phoneNumber,
      };
      if (!req.authData.isEmailVerified) {
        return Response.validatorError("Please Verify Your Account", res)
      }
    }

    const personalData = {
      ...vars,
      ...publicData,
    };

    req.form = personalData;
    next();
  };
};
