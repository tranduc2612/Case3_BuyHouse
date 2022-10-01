const mysql = require("mysql");
const fs = require("fs");

class DBConnection {
  constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "12345678",
      database: "BuyHouse",
      charset: "utf8_general_ci",
    });
  }

  async runMySQL(sql) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, (err, results, fields) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }
}

module.exports = new DBConnection();
