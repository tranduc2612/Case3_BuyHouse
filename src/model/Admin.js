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
        console.log(err.message);
      });
  }
}

module.exports = new Admin();
