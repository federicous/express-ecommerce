const pino = require("pino")({
	transport: {
	    targets: [
		{
		//     level: 'error',
		    level: 'debug',
		    target: 'pino/file',
		    options: { destination: './utils/logger/logs/error.log', mkdir: true }
		},
		{
		    target: 'pino-pretty',
		    //options: { translateTime: "SYS:dd-mm-yyyy HH:MM:ss" }
		    options: { translateTime: "SYS:dd-mm-yyyy HH:MM:ss", destination: './utils/logger/logs/info.log', mkdir: true }
		}
	    ]
	}
    })
    
    module.exports = pino
