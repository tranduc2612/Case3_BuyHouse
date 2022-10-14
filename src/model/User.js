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

  async getListUsersByEmail(data) {
    let sql = `select phone,passwordUR from tUser where email = '${data.email}'`;
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
    let sql = `insert into tUser(email,passwordUR,typeDK) values ('${data.email}','${data.password}',${data.type})`;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async updateUser(stringQuery) {
    let sql = stringQuery;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  // async updatePassword(sql){
  //   let sql = stringQuery;
  //   return await db
  //     .runMySQL(sql)
  //     .then((results) => {
  //       return results;
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // }
}

module.exports = new Users();
