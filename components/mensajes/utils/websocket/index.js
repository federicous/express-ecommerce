let {Server:SocketIO} = require('socket.io');
const pino = require('../../../../utils/logger/pino');
const misMensajes = require("../../services");

class Websocket {
	static instance
	constructor(http) {
		// Singleton:
		if (typeof Websocket.instance === "object") {
			return Websocket.instance;
		}

		Websocket.instance = this;
		this.io = new SocketIO(http)
		return this;
	}

	async init() {
		try {
			this.io.on('connection', async socket => {

				pino.info(`Nuevo usuario: ${socket.id}`);

				// Mensajes
				let misMensajesGuardados = await misMensajes.getAll()
				await this.io.sockets.emit('chat', misMensajesGuardados)

				await socket.on('userMsg', async data => {
					pino.info(data);
					await misMensajes.save(data)
					misMensajesGuardados = await misMensajes.getAll()
					await this.io.sockets.emit('chat', misMensajesGuardados)
				})

			})
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}

	}
}

module.exports = Websocket