const pino = require("pino")({
	transport: {
	    targets: [
		{
		//     level: 'error',
		    level: 'info',
		    target: 'pino-pretty',
		    options: { translateTime: "SYS:dd-mm-yyyy HH:MM:ss", destination: './utils/logger/logs/error.log',  translateTime: "SYS:dd-mm-yyyy HH:MM:ss", mkdir: true }
		},
		{
		    target: 'pino-pretty',
		    //options: { translateTime: "SYS:dd-mm-yyyy HH:MM:ss" }
		    options: { translateTime: "SYS:dd-mm-yyyy HH:MM:ss"}
		}
	    ]
	}
    })
    
    module.exports = pino
