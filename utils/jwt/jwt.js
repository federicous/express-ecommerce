const jwt = require('jsonwebtoken')
require("dotenv").config();
let PRIVATE_KEY = process.env.SECRET

class JWT {
    async generate(payload){
        try {
            return await jwt.sign(payload, PRIVATE_KEY, {
                expiresIn: '1d',
                algorithm: 'HS256'
            })
        } catch (error) {
		      console.log(error);
        }
    }
    async verify(token){
        try {
            return await jwt.verify(token, PRIVATE_KEY, {
                algorithm: ['HS256']
            })
        } catch (error) {
		console.log(error);
        }
    }
    async decode(token){
        try {
            return await jwt.decode(token, PRIVATE_KEY, {
                algorithm: ['HS256']
            })
        } catch (error) {
		console.log(error);
        }
    }
}

module.exports = new JWT();