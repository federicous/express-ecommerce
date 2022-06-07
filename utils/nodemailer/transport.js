const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
	    user: 'salma.keebler23@ethereal.email',
	    pass: 'vV2m39m5JSVwxbjBSg'
	}
    });

module.exports = transporter;
