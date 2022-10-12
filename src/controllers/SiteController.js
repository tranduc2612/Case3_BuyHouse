const fs = require("fs");
const session = require("./CookieAndSession");
const postHouse = require('../model/PostHouse');


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
      let html ="";
      let postLists =  await postHouse.getListPost();
      postLists.forEach((e)=>{
        html += `<div class="col-4">
        <div class="card__house px-3 py-2 d-flex flex-column justify-content-between" style="width: 18rem; height:350px" data-aos="zoom-out-left">
          <div class="card__img" style="width: 100%;
          height: 160px;
          background-image: url('${e.image}');
          background-size: cover;
          border-radius: 10px;
          background-repeat: no-repeat;
          background-position: center;
          ">
          </div>
          <h5 class="card-title mt-2">${e.address}</h5>
          <div class="card__body d-flex flex-column">
            <span class="card-text-price">${e.cost} đ</span>
            <span class="card-text-date "><i class="fa-solid fa-clock me-1"></i>${e.datePost}</span>
          </div>
        </div>
      </div>`
      console.log(e.datePost)
      });
      data = data.replace("{PostHouse-Lists}",html);
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
