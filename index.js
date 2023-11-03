const Server = require('./server/server')
const ServerHttps = require('./server/serverHttps')
require('dotenv').config()

if (process.env.NODE_ENV === 'production') {
	const server = new ServerHttps();
	server.init()
} else {
	const serverHttps = new Server();
	serverHttps.init()
}

// const server = new Server();
// server.init()