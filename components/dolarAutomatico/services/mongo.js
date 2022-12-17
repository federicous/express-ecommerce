let DolarModel = require('../../../schema/dolar');
const pino = require('../../../utils/logger/pino');
let ApiQuery = require('../../../utils/dolar/dolar')
let apiQuery = new ApiQuery();

class ElementService {

	async getPrecio() {
		try {
			let dolar = await DolarModel.findOne({
				tipo: "bna"
			});
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
				let agregarDolar = await DolarModel.findOneAndUpdate({
					tipo: `${element.tipo}`
				}, element)
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

	async postPrecioAutomatico(element) {
		try {
			setInterval(async () => {

				let date = new Date();
				if (date.getHours() === 11 && date.getDay() >= 1 && date.getDay() <= 5) { // si son las 11 y estamos entre lunes y viernes
					let respuesta = await apiQuery.get(`https://www.bna.com.ar/Personas`)
					let busqueda = respuesta.split("\r\n");
					let res = busqueda.findIndex(fila => /Dolar U.S.A/.test(fila));
					let precioDolar = busqueda[res + 2].replace(',', '.').replace(/.*<td>/, '').replace(/<\/td>.*/, '');
					console.log(`precioDolar api ${precioDolar}`);
					element.dolar = precioDolar
					element.timestamp = Date.now();

					let objectDate = new Date()
					let day = objectDate.getDate();
					let month = objectDate.getMonth();
					let year = objectDate.getFullYear();
					let hour = objectDate.getHours();
					let minute = objectDate.getMinutes();
				      
					if (day < 10) {day = '0' + day;}
					if (month < 9) {month = `0${month+1}`;}
					if (hour < 10) {hour = '0' + hour;}
					if (minute < 10) {minute = `0${minute}`;}
				      
					element.fecha = `${day}/${month}/${year-2000} ${hour}:${minute}`;

					let verificarExistente = await DolarModel.find({
						tipo: `${element.tipo}`
					})
					if (verificarExistente.length) {
						pino.info(`actualizando precio del dolar ${element.tipo} --> valor ${element.dolar}`);
						let agregarDolar = await DolarModel.findOneAndUpdate({
							tipo: `${element.tipo}`
						}, element)
						return agregarDolar
					} else {
						element.timestamp = Date.now();

						let agregarDolarModel = new DolarModel(element);
						let agregarDolar = await agregarDolarModel.save();
						pino.info(agregarDolar);
					}
				}
			}, 1000 * 60 * 30); // Donde 1000*60*30 sería cada 30 minutos
			// return agregarDolar
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

}

module.exports = ElementService;