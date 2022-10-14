const db = require("./DBConnect");

class PostHouse {
  async getListPost() {
    let sql =
      "select * from Post join Image on Post.postId = Image.postId group by Post.postId";
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
