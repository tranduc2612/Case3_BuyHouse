const fs = require("fs");
const session = require("./CookieAndSession");
const postHouse = require("../model/PostHouse");

class SiteController {
  async showHomePage(req, res) {
    let isLogin = session.checkingSession(req);
    fs.readFile("./src/views/home.html", "utf-8", async (err, data) => {
      if (err) {
        console.log(err.message);
      }
      if (isLogin) {
        let newData = await session.changeFontEnd(data, isLogin);
        data = data.replace(data, newData);
      }

      if (session.checkingSessionGG(req)) {
        session.deleteSessionGG(req);
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }

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
}

module.exports = new SiteController();
