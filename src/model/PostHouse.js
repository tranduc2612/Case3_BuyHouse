const db = require('./DBConnect');

class PostHouse{
    async getListPost(){
        let sql = "select image,address, cost,datePost from Post";
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
module.exports = new PostHouse();