const testCode = 123456;
const between = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};
  
const generateEmailCode = () => {
    if (process.env.EMAIL_PIPE === "production") {
        const emailCode = between(100000, 200000);

        return emailCode;
    }
    return testCode;
};

const generatePhoneNumberCode = () => {
    if (process.env.SMS_PIPE === "production") {
        const phoneNumberCode = between(100000, 200000);

        return phoneNumberCode;
    }
    return testCode;
};

const removeConfidentialData = (data) => {
    let result;
    if (data.length > 0) {
        result = data.map((object) => {
            const { password, emailCode, phoneNumberCode, __v, _id, ...serializeUserDetails } =
                JSON.parse(JSON.stringify(object));

            return serializeUserDetails;
        });
    } else {
        const { password, emailCode, phoneNumberCode, passwordCode, passwordResetCodeExpiresAt, __v, _id, ...serializeUserDetails } =
        JSON.parse(JSON.stringify(data));

        result = serializeUserDetails;
    }

    return result;
}

module.exports = {
    generateEmailCode,
    generatePhoneNumberCode,
    removeConfidentialData
};