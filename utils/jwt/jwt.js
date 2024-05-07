const jwt = require('jsonwebtoken')
const pino = require('../../utils/logger/pino')
const {autenticacion} = require('../../config')

class JWT {
    async generate(payload){
        try {
            return await jwt.sign(payload, autenticacion.JWT_SECRET, {
                expiresIn:  autenticacion.JWT_EXP,
                algorithm: autenticacion.JWT_ALG
            })
        } catch (error) {
              pino.error(`Se produjo un error: ${error}`)
        }
    }
    async verify(token){
        console.log(`TOKEN VERIFY: ${token}`);
        try {
            return await jwt.verify(token, autenticacion.JWT_SECRET, {
                algorithm: [autenticacion.JWT_ALG]
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
        }
    }
    async decode(token){
        console.log(`TOKEN DECODE: ${token}`);
        try {
            return await jwt.decode(token, autenticacion.JWT_SECRET, {
                algorithm: [autenticacion.JWT_ALG]
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`)
        }
    }
}

module.exports = new JWT();