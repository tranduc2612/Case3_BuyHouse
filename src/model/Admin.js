const db = require("./DBConnect");

class Admin {
  async getListUsers() {
    let sql = "SELECT * FROM tAdmin";
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = new Admin();
