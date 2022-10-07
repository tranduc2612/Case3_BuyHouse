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

  async getListUsersByEmail(email){
    let sql = `select * from tUser where email = ${email}`;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async getListUsersByPhone(phone){
    let sql = `select * from tUser where phone = ${phone}`;
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
    let sql = `insert into tUser(phone,passwordUR) values ('${data.phone}','${data.password}')`;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async insertUserEmail(data) {
    let sql = `insert into tUser(email,phone,passwordUR) values ('${data.email}','${data.phone}','${data.password}')`;
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
