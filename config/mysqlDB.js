require("dotenv").config();

const mysqlConfig={
	client: 'mysql',
	connection: {
	  host: process.env.MARIADB_HOST,
	  user: process.env.MARIADB_USER,
	  password: process.env.MARIADB_PASS,
	  database: process.env.MARIADB_DATABASE
	}
}

module.exports={mysqlConfig}