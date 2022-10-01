const db = require("./DBConnect");

class Users {
  async getListUserRent() {
    let sql = "select * from tUserRenter";
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
