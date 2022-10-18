const fs = require("fs");
const qs = require("qs");
const url = require("url");
const userDB = require("../model/User");
const session = require("./CookieAndSession");
const jwt = require("jsonwebtoken");
const postHouse = require("../model/PostHouse");
class HouseController {
  async loadDataInForm(req) {
    let data = "";
    return new Promise((resolve, reject) => {
      req.on("data", (chunks) => {
        data += chunks;
      });
      req.on("end", () => {
        data = qs.parse(data);
        resolve(data);
      });
      req.on("error", (err) => {
        reject(err);
      });
    });
  }

  async buyHouse(req, res) {
    const idPost = url.parse(req.url, true).query.idPost;
    const idUserRent = session.checkingSession(req)[0];
    const nameUserRent = session.checkingSession(req)[1];
    const currentDate = new Date();
    let date =
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate();
    const data = {
      date,
      idPost,
      idUserRent,
      nameUserRent
    };

    await postHouse.addNoitice(data);
    res.statusCode = 302;
    res.setHeader("Location", "/notification");
    res.end();
  }
}

module.exports = new HouseController();
