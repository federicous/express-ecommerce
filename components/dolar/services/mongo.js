let DolarModel = require('../../../schema/dolar');
const pino = require('../../../utils/logger/pino');

class ElementService {

	async getPrecio() {
		try {
			let dolar = await DolarModel.findOne({
				tipo: "bna"
			});
			pino.info(`el precios del dolar: ${dolar}`);
			return dolar
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

	async postPrecio(element) {
		try {

			// let agregarDolarModel = new DolarModel(element);
			// let agregarDolar = await agregarDolarModel.save();

			let verificarExistente = await DolarModel.find({
				tipo: `${element.tipo}`
			})
			if (verificarExistente.length) {
				pino.info(`actualizando precio del dolar ${element.tipo}`);
				let agregarDolar = await DolarModel.findOneAndUpdate({tipo: `${element.tipo}`}, element)
				return agregarDolar
			} else {
				element.timestamp = Date.now();

				let agregarDolarModel = new DolarModel(element);
				let agregarDolar = await agregarDolarModel.save();
				pino.info(agregarDolar);
			}

			return agregarDolar
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

}

module.exports = ElementService;