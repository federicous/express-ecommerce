const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
	    user: 'courtney.gusikowski68@ethereal.email',
	    pass: 'RcUWuPSPrjQfbqMzpR'
	}
    });

module.exports = transporter;
