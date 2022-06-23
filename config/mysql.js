const {mysql}= require("../config")

const mysqlConfig={
	client: 'mysql',
	connection: {
	  host: mysql.MARIADB_HOST,
	  user: mysql.MARIADB_USER,
	  password: mysql.MARIADB_PASS,
	  database: mysql.MARIADB_DATABASE
	}
}

module.exports={mysqlConfig}