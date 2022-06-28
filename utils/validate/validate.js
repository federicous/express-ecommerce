let validator = require('validator');
const pino = require('../../utils/logger/pino')

class Validation {
	async password(usuario) {
		try {
			let passwordValidation = validator.isStrongPassword(usuario.confirmPassword, {
				minLength: 4,
				minUppercase: 0,
				minSymbols: 0
			});
			
			if (usuario.password == usuario.confirmPasword && passwordValidation) {
				return true
			} else {
				return false
			}

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`);
		}
	}

}
module.exports = new Validation;