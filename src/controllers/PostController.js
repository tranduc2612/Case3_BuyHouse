const fs = require("fs");
const qs = require("qs");
const url = require("url");
const postHouse = require("../model/PostHouse");
const session = require("../controllers/CookieAndSession");

class PostController {
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

  async createPost(req, res) {
    const formInput = await this.loadDataInForm(req);
    const idUser = session.checkingSession(req)[0];
    formInput.inputURL = formInput.inputURL.split(",");
    const currentTime = new Date();
    const queryTime = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}`;
    const strQuery = `insert Post(title,userId,datePost,address,lat,lng,cost,statusHouse,descriptionPost)
    values('${formInput.inputTitle}',${idUser},'${queryTime}','${formInput.inputAddress}','${formInput.lat}','${formInput.lng}',${formInput.inputPrice},'cho thuê','${formInput.inputAddress}');`;
    await postHouse.createPost(strQuery);
    res.statusCode = 302;
    res.setHeader("Location", "/category");
    res.end();
  }
}

module.exports = new PostController();
