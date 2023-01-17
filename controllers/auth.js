const Response = require('../helpers/response');
const generalHelper = require('../helpers/generalHelper');
const { Account } = require('../model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const moment = require('moment');

const accountRegistration = async(req, res) => {
    try{
        const { email, password, phoneNumber, accountType, firstName, lastName } = req.body;
        // check if email is already in use
        const existingUser = await Account.findOne({email});
        if(existingUser) {
            return Response.failureResponse("Email already exist", {email}, res);
        }
        // Check if phoneNumber already in use
        const existingNumber = await Account.findOne({phoneNumber});
        if(existingNumber) {
            return Response.failureResponse("Phone number already in use", {phoneNumber}, res);
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate email and phone verification codes
        const emailCode = generalHelper.generateEmailCode();
        const phoneNumberCode = generalHelper.generatePhoneNumberCode();

        // Send the emailCode and phoneCode to the users email and phoneNumber
        // Respectively to verify (Feature to be added soon)

        // Create the account
        const newAccount = await Account.create({
            email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            emailCode,
            phoneNumberCode,
            accountType,
            role: "guest",
            firstName,
            lastName
        });

        // Remove confidential data from the return data
        const accountData = generalHelper.removeConfidentialData(newAccount);

        return Response.createdResponse('Account creation successful', accountData, res)
    } catch(err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in Account Creation endpoint',
            res, err
        );
    }
}

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        //Check if account exist
        const account = await Account.findOne({email: email});
        if(!account) {
            return Response.UnprocessableResponse("Incorrect credentials", res);
        }
        //Check if password match
        const passwordMatch = await bcrypt.compare(password, account.password);
        if(!passwordMatch) {
            return Response.UnprocessableResponse("Incorrect credentials", res);
        }

        // Check if account is verified
        if(account.isEmailVerified === false) {
            return Response.UnprocessableResponse("Verify email before login", res);
        }

        if(account.isPhoneVerified === false) {
            return Response.UnprocessableResponse("Verify phone number before login", res);
        }
        //Serialize account data
        const accountData = generalHelper.removeConfidentialData(account);

        //Generate JWT token
        const token = jwt.sign(accountData, process.env.JWT_KEY, {expiresIn: process.env.TOKEN_VALIDATION_DURATION});

        return Response.loginResponse(
            token,
            'Login successful', 
            accountData,
            res
        );

    } catch (err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in Login endpoint',
            res, err
        );
    }
}

const resendVerificationCode = async(req, res) => {
    try{
        const { email, phoneNumber, verificationMethod } = req.body;
        if(verificationMethod === 'email') {
            //Check if email exist
            const emailExist = await Account.findOne({email});
            if(!emailExist){
                return Response.UnprocessableResponse("Email does not exist", res);
            }
            //Generate email code to resend
            const emailCode = generalHelper.generateEmailCode();
            //Update the email code in the DB
            await Account.updateOne({email}, {emailCode});

            //IMPLEMENT EMAIL SENDING MECHANISM HERE

            return Response.simpleResponse(
                'Verification code sent succesfully',
                res
            );
        } else{
            //Check if phoneNumber exist
            const phoneExist = await Account.findOne({phoneNumber});
            if(!phoneExist){
                return Response.UnprocessableResponse("Phone number does not exist", res);
            }
            //Generate phone code to resend
            const phoneNumberCode = generalHelper.generatePhoneNumberCode();
            //Update the phone number code in the DB
            await Account.updateOne({phoneNumber}, {phoneNumberCode});

            //IMPLEMENT OTP SENDING MECHANISM HERE

            return Response.simpleResponse(
                'Verification code sent succesfully',
                res
            );
        }
    } catch(err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in resendVerificationCode endpoint',
            res, err
        );
    }
}

const verifyAccount = async(req, res) => {
    try{
        const { emailCode, phoneNumberCode, authId, verificationMethod } = req.body;
        //Check if id exist
        const account = await Account.findOne({_id: authId});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }
        //Check if email and phone number is verified
        if(verificationMethod === 'email'){
            if(account.isEmailVerified){
                return Response.UnprocessableResponse("Email already verified", res);
            }
            //Check if the code is valid
            if(emailCode !== account.emailCode){
                return Response.UnprocessableResponse("Wrong verification code", res);
            }
            //Update account to verify
            account.isEmailVerified = true;
            account.save();

             // Remove confidential data from the account data
            const accountData = generalHelper.removeConfidentialData(account);

            return Response.successResponse('Email verification successful', accountData, res);
        }

        //Else Verify Phone Number
        if(account.isPhoneVerified){
            return Response.UnprocessableResponse("Phone Number already verified", res);
        }
        //Check if the code is valid
        if(phoneNumberCode !== account.phoneNumberCode){
            return Response.UnprocessableResponse("Wrong verification code", res);
        }
        //Update account to verify
        account.isPhoneVerified = true;
        account.save();

         // Remove confidential data from the account data
        const accountData = generalHelper.removeConfidentialData(account);

        return Response.successResponse('Phone Number verification successful', accountData, res)
        
    } catch(err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in verifyAccount endpoint',
            res, err
        );
    }
}

const sendPasswordResetCode = async(req, res) => {
    try{
        const { email } = req.body;
        //Check if account exist
        const account = await Account.findOne({email});
        if(!account){
            return Response.UnprocessableResponse("Account does not exist", res);
        }

        //Generate code to send to user
        const passwordCode = generalHelper.generateEmailCode();
        const dateObj = new Date();
        //Set timer for password expiration
        const passwordExpiresAt = moment(dateObj).add(2, 'h').toString();
        //Save the code in the DB
        account.passwordCode = passwordCode;
        account.passwordResetCodeExpiresAt = passwordExpiresAt;
        account.save();
        
        //IMPLEMENT THE EMAIL MECHANISM TO SEND TO USER

        return Response.simpleResponse("Password reset code sent", res);
    } catch(err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in forgotPassword endpoint',
            res, err
        );
    }
}

const validatePasswordResetCode = async(req, res) => {
    try{
        const { email, passwordCode } = req.body;
        //Check if account exist
        const account = await Account.findOne({email});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }

        //Check if password code has expired
        const currentDate = new Date().toString();
        if(currentDate > account.passwordResetCodeExpiresAt) {
            return Response.UnprocessableResponse("Password code has expired", res);
        }
        //Check if the passwordCode matches wht is in the DB
        if(passwordCode !== account.passwordCode) {
            return Response.UnprocessableResponse("Wrong password reset code", res);
        }

        return Response.simpleResponse('Valid pasword code', res);
    } catch(err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in validatePasswordResetCode endpoint',
            res, err
        );
    }
}

const updatePassword = async(req, res) => {
    try{
        const { email, password } = req.body;
        //Check if account exist
        const account = await Account.findOne({email});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }
        //Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);
        account.password = hashedPassword;
        account.save();

        return Response.simpleResponse('Password change successful', res);
    } catch(err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in update password endpoint',
            res, err
        );
    }
}

const updateAccount = async(req, res) => {
    try{
        const { firstName, lastName, authId} = req.body;
        //Check if account exist
        const account = await Account.findOne({_id: authId});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }
        //Update account details
        account.firstName = firstName !== undefined ? firstName : account.firstName;
        account.lastName = lastName !== undefined ? lastName : account.lastName;
        account.save();

        // Serialize updated account before returning to user
        const accountData = generalHelper.removeConfidentialData(account);

        return Response.createdResponse('Account updated successfully', accountData, res);
    } catch(err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in update account endpoint',
            res, err
        );
    }
}

const assignRole = async(req, res) => {
    try{
        const { userId, role } = req.body;
        // Check if account is authorised to perform this task
        if(req.auth.accountType !== 'admin') {
            return Response.unAuthorizedResponse('You are not authorized to perform this task!', res);
        }
        //Check if account exist
        const account = await Account.findOne({_id: userId});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }
        // Check if account type is valid for assignment
        if(account.accountType !== 'staff') {
            return Response.UnprocessableResponse("Role cannot be assigned to this account", res);
        }
        // Assign role
        account.role = role;
        account.save();

        // Serialize updated account before returning to user
        const accountData = generalHelper.removeConfidentialData(account);

        return Response.createdResponse('Role assigned successfully', accountData, res);
    } catch(err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in update account endpoint',
            res, err
        );
    }
}

module.exports = {
    accountRegistration,
    login,
    resendVerificationCode,
    verifyAccount,
    sendPasswordResetCode,
    validatePasswordResetCode,
    updatePassword,
    updateAccount,
    assignRole
}