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
    try {
      const isLogin = session.checkingSession(req);
      if (isLogin[7] == 1) {
        res.statusCode = 302;
        res.setHeader("Location", "/notfound");
        res.end();
      }
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
        nameUserRent,
      };
      console.log(idUserRent);
      await postHouse.addNoitice(data);
      res.statusCode = 302;
      res.setHeader("Location", "/notification");
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async acceptReq(req, res) {
    try {
      const dataUrl = url.parse(req.url, true).query;
      const idNoti = dataUrl.idNoti;
      // const dataNoti = await postHouse.getNotice(idNoti);
      await postHouse.changeStatusNotice("Đang chờ chốt deal", idNoti);
      res.statusCode = 302;
      res.setHeader("Location", "/notification");
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async denyReq(req, res) {
    try {
      const dataUrl = url.parse(req.url, true).query;
      const idNoti = dataUrl.idNoti;
      // const dataNoti = await postHouse.getNotice(idNoti);
      await postHouse.changeStatusNotice("Đã hủy", idNoti);
      res.statusCode = 302;
      res.setHeader("Location", "/notification");
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async acceptDeal(req, res) {
    try {
      const dataUrl = url.parse(req.url, true).query;
      const idNoti = dataUrl.idNoti;
      const idPost = dataUrl.idPost;
      await postHouse.updateStatusPost(idPost, "Đã thuê");
      await postHouse.changeStatusNotice("Chốt deal thành công", idNoti);
      res.statusCode = 302;
      res.setHeader("Location", "/notification");
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async checkInHouse(req, res) {
    try {
      const dataUrl = url.parse(req.url, true).query;
      const idNoti = dataUrl.idNoti;
      const idPost = dataUrl.idPost;
      await postHouse.updateStatusPost(idPost, "Cho thuê");
      await postHouse.changeStatusNotice("Đã trả phòng", idNoti);
      res.statusCode = 302;
      res.setHeader("Location", "/notification");
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new HouseController();
