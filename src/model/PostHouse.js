const db = require('./DBConnect');

class PostHouse{
    async getListPost(){
        let sql = "select  title, cost, datePost,address, url from Post join Image on Image.postId = Post.postId group by title";
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