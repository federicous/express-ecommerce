const jwt = require('jsonwebtoken');
const pino = require('../../utils/logger/pino');
const { autenticacion } = require('../../config');

class JWT {
    async generate(payload, expiresIn = autenticacion.JWT_EXP) {
        try {
            return jwt.sign(payload, autenticacion.JWT_SECRET, {
                expiresIn,
                algorithm: autenticacion.JWT_ALG
            });
        } catch (error) {
            pino.error(`Se produjo un error al generar JWT: ${error}`);
            return null;
        }
    }

    async verify(token) {
        try {
            return jwt.verify(token, autenticacion.JWT_SECRET, {
                algorithms: [autenticacion.JWT_ALG]
            });
        } catch (error) {
            pino.error(`Se produjo un error al verificar JWT: ${error}`);
            return null;
        }
    }

    async decode(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            pino.error(`Se produjo un error al decodificar JWT: ${error}`);
            return null;
        }
    }
}

module.exports = new JWT();
