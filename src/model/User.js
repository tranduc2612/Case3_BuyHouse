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

  async insertListUserRent(phone,password){
    let sql = `INSERT into tUserRenter (phone, passwordUR) values('${phone}','${password}')`;
    return await db
          .runMySQL(sql)
          .then((results) =>{
            return results;
          })
          .catch((err) =>{
            throw err;
          })
  }

}

module.exports = new Users();
