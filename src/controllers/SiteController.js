const fs = require("fs");
const session = require("./CookieAndSession");

class SiteController {
  async showHomePage(req, res) {
    let isLogin = session.checkingSession(req, res);
    fs.readFile("./src/views/home.html", "utf-8", async (err, data) => {
      if (err) {
        console.log(err.message);
      }
      if (isLogin) {
        let newData = await session.changeFontEnd(data, isLogin);
        data = data.replace(data, newData);
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }
}

module.exports = new SiteController();
