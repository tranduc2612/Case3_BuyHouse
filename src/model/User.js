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
        console.log(err.message);
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
        console.log(err.message);
      });
  }
}

module.exports = new Users();
