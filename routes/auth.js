const { Router } = require('express');
const auth = require('../controllers/auth');
const { validate } = require("../middlewares");
const validator = require("../validator/auth");

const routes = Router();

routes.post(
    "/create-account", 
    validate(validator.accountRegistration), 
    auth.accountRegistration
);

routes.post(
    "/login", 
    validate(validator.login), 
    auth.login
);

routes.post(
    "/resend-verificationCode", 
    validate(validator.resendVerificationCode), 
    auth.resendVerificationCode
);

routes.post(
    "/verify-account", 
    validate(validator.verifyAccount), 
    auth.verifyAccount
);

routes.post(
    "/forgot-password", 
    validate(validator.sendPasswordResetCode), 
    auth.sendPasswordResetCode
);

routes.post(
    "/validate-password-reset-code", 
    validate(validator.validatePasswordResetCode), 
    auth.validatePasswordResetCode
);

routes.post(
    "/update-password", 
    validate(validator.updatePassword), 
    auth.updatePassword
);

routes.post(
    "/update-account", 
    validate(validator.updateAccount), 
    auth.updateAccount
);

routes.put(
    "/assign-role", 
    validate(validator.assignRole), 
    auth.assignRole
);



module.exports = routes;