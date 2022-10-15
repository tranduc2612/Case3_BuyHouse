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
      let html = "";
      let postLists = await postHouse.getListPost();
      postLists.forEach((e) => {
        html += `<div class="col-4">
        <a class="card__house px-3 py-2 d-flex flex-column justify-content-between" style="width: 18rem; height:350px" data-aos="zoom-out-left" href="/detail-post/${
          e.postId
        }">
          <div class="card__img" style="width: 100%;
          height: 160px;
          background-image: url('${e.url}');
          background-size: cover;
          border-radius: 10px;
          background-repeat: no-repeat;
          background-position: center;
          ">
          </div>
          <h5 class="card-title mt-2" style="color: #333;">${e.title}</h5>
          <div class="card__body d-flex flex-column">
          <span class="card-text-address">${e.address} </span>
            <span class="card-text-price">${e.cost} đ</span>
            <span class="card-text-date "><i class="fa-solid fa-clock me-1"></i>${e.datePost
              .toISOString()
              .slice(0, 10)}</span>
          </div>
        </a>
      </div>`;
        // console.log((e.datePost).toISOString().slice(0,10))
      });
      data = data.replace("{PostHouse-Lists}", html);
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
