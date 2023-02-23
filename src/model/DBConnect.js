const mysql = require("mysql");
const fs = require("fs");

class DBConnection {
	constructor() {
		// this.connection = mysql.createConnection({
		//   host: "localhost",
		//   user: "root",
		//   password: "12345678",
		//   database: "BuyHouse",
		//   charset: "utf8_general_ci",
		// });

		this.connection = mysql.createConnection({
			host: "bhz3c4c1tjawjdejfh9y-mysql.services.clever-cloud.com",
			user: "umckebfcypb1wh9q",
			password: "NTv0jlGwaWMckadgkTLd",
			database: "bhz3c4c1tjawjdejfh9y",
			charset: "utf8_general_ci",
		});
	}

	async runMySQL(sql) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, (err, results, fields) => {
				if (err) {
					reject(err);
				}
				// console.log("success");
				resolve(results);
			});
		});
	}
}

module.exports = new DBConnection();
