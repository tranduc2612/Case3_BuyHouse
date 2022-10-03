const fs = require("fs");
const qs = require("qs");
const userDB = require("../model/User");
const session = require("./CookieAndSession");
const jwt = require("jsonwebtoken");
let userWrong = false;
class AuthController {
  async showLoginPage(req, res) {
    fs.readFile("./src/views/login.html", "utf-8", function (err, data) {
      if (err) {
        console.log(err.message);
      }
      if (userWrong == true) {
        data = data.replace(
          "input__phone custom-input p-2",
          "input__phone custom-input p-2 inputWrong"
        );

        data = data.replace(
          `<span class="message d-none"></span>`,
          `<span class="message messageWrong">Số điện thoại sai hoặc không tồn tại !</span>`
        );
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }

  async checkLogin(req, res) {
    const inputForm = await this.loadDataInForm(req);
    const userData = await userDB.getListUserRent();
    for (let i = 0; i < userData.length; i++) {
      if (
        userData[i].phone == inputForm.phone &&
        userData[i].passwordUR == inputForm.password
      ) {
        let newData = [...Object.values(userData[i]), false];
        userWrong = false;
        session.writeCookieAndSession(req, res, newData);
        return;
      }
    }
    userWrong = true;
    res.statusCode = 302;
    res.setHeader("Location", "/login");
    res.end();
  }

  async logOutUser(req, res) {
    await session.deleteSession(req);
    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end();
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

  async loginWithGoogle(req, res, token) {
    const decoded = jwt.decode(token);
    const newData = [
      decoded.jti,
      decoded.family_name,
      decoded.name,
      decoded.email,
      decoded.picture,
      true,
    ];
    session.writeCookieAndSession(req, res, newData);
  }

  async showInfoUser(req, res) {
    let isLogin = session.checkingSession(req, res);
    if (isLogin) {
      fs.readFile("./src/views/infouser.html", "utf-8", async (err, data) => {
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

  async showRegisterPage(req, res) {
    fs.readFile("./src/views/register.html", "utf-8", function (err, data) {
      if (err) {
        console.log(err.message);
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }

  async checkRegister(req, res) {
    const inputForm = await this.loadDataInForm(req);
    const phone = inputForm.phone;
    const password = inputForm.password;
    const userData =  await userDB.getListUserRent();
    // console.log(userData)
    for(let i = 0; i < userData.length; i++) {
      if(userData[i].phone == phone && userData[i].passwordUR == password){
        // console.log("Tai khoan da ton tai");
        res.end('Tai khoan da ton tai')
        return 
      }
    }
    await userDB.insertListUserRent(phone,password);
    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end();
  }
}

module.exports = new AuthController();
