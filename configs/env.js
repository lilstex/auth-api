const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

// Configure the SendGrid transporter
const options = {
    auth: {
        api_key: process.env.SEND_GRID_API_KEY,
    },
};
  
const transporter = nodemailer.createTransport(sgTransport(options));
module.exports = transporter;  