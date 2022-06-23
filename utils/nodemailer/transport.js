const nodemailer = require('nodemailer');
const {correo} = require('../../config')

const transporter = nodemailer.createTransport({
	host: correo.NODEMAILER_HOST,
	port: correo.NODEMAILER_PORT,
	auth: {
	    user: correo.NODEMAILER_USER,
	    pass: correo.NODEMAILER_PASS
	}
    });

module.exports = transporter;
