const db = require("./DBConnect");

class Users {
  async getListUser() {
    let sql = "select * from tUser";
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async insertUser(data) {
    let sql = "select * from tUser";
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

module.exports = new Users();
