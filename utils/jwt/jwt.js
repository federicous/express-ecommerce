const jwt = require('jsonwebtoken')
require("dotenv").config();
let PRIVATE_KEY = process.env.SECRET
const pino = require('../../utils/logger/pino')

class JWT {
    async generate(payload){
        try {
            return await jwt.sign(payload, PRIVATE_KEY, {
                expiresIn: '1d',
                algorithm: 'HS256'
            })
        } catch (error) {
              pino.error(`Se produjo un error: ${error}`)
        }
    }
    async verify(token){
        try {
            return await jwt.verify(token, PRIVATE_KEY, {
                algorithm: ['HS256']
            })
        } catch (error) {
        pino.error(`Se produjo un error: ${error}`)
        }
    }
    async decode(token){
        try {
            return await jwt.decode(token, PRIVATE_KEY, {
                algorithm: ['HS256']
            })
        } catch (error) {
        pino.error(`Se produjo un error: ${error}`)
        }
    }
}

module.exports = new JWT();