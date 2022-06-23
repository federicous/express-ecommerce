let path = require("path");
const pino = require('../utils/logger/pino')
let DBPath = path.join(__dirname, 'DB');
pino.info(`${DBPath}/mydb.sqlite`);

const sqliteConfig={
	client: 'sqlite3',
	connection: {
	filename: 'DB/mydb.sqlite'
	},
	useNullAsDefault: true
}

module.exports={sqliteConfig}