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

  async insertCommentDB(query) {
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

  async deleteComment(id) {
    let sql = `delete from tComment where idComment = ${id}`;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async getListComment(query) {
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

  async insertImgData(idPost, url) {
    let sql = `insert Image(postId, url) values(${idPost},'${url}')`;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async getNumberPostDB() {
    let sql = `select count(postId) as SoLuongPost from Post`;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async updateStatusPost(idPost, statusPost) {
    let sql = `update Post set statusHouse = '${statusPost}' where postId = ${idPost};`;
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

  async addNoitice(data) {
    let sql = `insert Noti(statusNoti,dateNoti,postId,idUserRent,nameUserRent) values('Đang chờ duyệt','${data.date}',${data.idPost},${data.idUserRent},'${data.nameUserRent}');`;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async changeStatusNotice(status, idNotice) {
    let sql = `update Noti set statusNoti = '${status}' where idNoti = ${idNotice};`;
    return await db
      .runMySQL(sql)
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  async getNotice(idNotice) {
    let sql = `select * from Noti where idNoti = '${idNotice}'`;
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
