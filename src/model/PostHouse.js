const db = require("./DBConnect");

class PostHouse {
  async getListPost() {
    let sql =
      "select Post.postId, title, cost, datePost,addressPost, url from Post join Image on Image.postId = Post.postId group by Post.postId";
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async getDataPost(query) {
    let sql = query;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async createPost(strQuery) {
    let sql = strQuery;
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
