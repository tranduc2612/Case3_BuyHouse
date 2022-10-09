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

  async showCategoryPage(req, res) {
    let isLogin = session.checkingSession(req, res);
    fs.readFile("./src/views/categorypost.html", "utf-8", async (err, data) => {
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

  async showDetailPost(req, res) {
    let isLogin = session.checkingSession(req, res);
    if (isLogin) {
      fs.readFile("./src/views/postdetail.html", "utf-8", async (err, data) => {
        if (err) {
          console.log(err.message);
        }
        let newData = await session.changeFontEnd(data, isLogin);
        data = data.replace(data, newData);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      });
    } else {
      res.statusCode = 302;
      res.setHeader("Location", "/login");
      res.end();
    }
  }

  async showCreatePost(req, res) {
    let isLogin = session.checkingSession(req, res);
    if (isLogin) {
      fs.readFile("./src/views/createpost.html", "utf-8", async (err, data) => {
        if (err) {
          console.log(err.message);
        }
        let newData = await session.changeFontEnd(data, isLogin);
        data = data.replace(data, newData);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      });
    } else {
      res.statusCode = 302;
      res.setHeader("Location", "/login");
      res.end();
    }
  }
}

module.exports = new SiteController();
