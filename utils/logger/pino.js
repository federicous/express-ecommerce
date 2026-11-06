// Immutable production releases must never write logs inside the artifact.
// JSON stdout is collected by the process manager; dev keeps the legacy pretty transport.
module.exports = process.env.NODE_ENV === 'production'
    ? require('pino')()
    : require("pino")({
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
    });
