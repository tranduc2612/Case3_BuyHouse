const fs = require("fs");
const qs = require("qs");
const userDB = require("../model/User");
const session = require("./CookieAndSession");
const jwt = require("jsonwebtoken");
let userWrong = false;
let gmailWrong = false;

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
      if (gmailWrong == true) {
        data = data.replace(
          "input__phone custom-input p-2",
          "input__phone custom-input p-2 inputWrong"
        );

        data = data.replace(
          `<span class="message d-none"></span>`,
          `<span class="message messageWrong">Gmail này chưa được đăng kí !</span>`
        );
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }

  async checkLogin(req, res) {
    const inputForm = await this.loadDataInForm(req);
    const userData = await userDB.getListUser();

    for (let i = 0; i < userData.length; i++) {
      if (
        userData[i].phone == inputForm.phone &&
        userData[i].passwordUR == inputForm.password
      ) {
        let newData = [
          userData[i].userId,
          userData[i].nameUser,
          userData[i].address,
          userData[i].phone,
          userData[i].password,
          userData[i].email,
          userData[i].cccd,
          +userData[i].typeDK.toString("hex"),
          userData[i].dateDK,
          false,
        ];
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
    try {
      const decoded = jwt.decode(token);
      const userData = await userDB.getListUser();
      let newData = [];
      for (let i = 0; i < userData.length; i++) {
        if (userData[i].email == decoded.email) {
          newData = [
            userData[i].userId,
            userData[i].nameUser
              ? userData[i].nameUser
              : (userData[i].nameUser = decoded.name),
            userData[i].address,
            userData[i].phone,
            userData[i].password,
            userData[i].email,
            userData[i].cccd,
            +userData[i].typeDK.toString("hex"),
            userData[i].dateDK,
            decoded.picture,
            true,
          ];
          gmailWrong = false;
          session.writeCookieAndSession(req, res, newData);
          return;
        }
      }
      gmailWrong = true;
      res.statusCode = 302;
      res.setHeader("Location", "/login");
      res.end();
    } catch (error) {
      console.log(error.message);
    }
  }

  async showInfoUser(req, res) {
    let isLogin = session.checkingSession(req);
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
      if (userWrong == true) {
        data = data.replace(
          "input__phone custom-input p-2",
          "input__phone custom-input p-2 inputWrong"
        );

        data = data.replace(
          `<span class="message d-none"></span>`,
          `<span class="message messageWrong">Số điện thoại đã tồn tại !</span>`
        );
      }
      if(gmailWrong == true) {
        data = data.replace(
          "input__phone custom-input p-2",
          "input__phone custom-input p-2 inputWrong"
        );

        data = data.replace(
          `<span class="message d-none"></span>`,
          `<span class="message messageWrong">Gmail đã được sử dụng!</span>`
        );
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }

  async registerWithGoogle(req, res, token) {
    const decoded = jwt.decode(token);
    const userData = await userDB.getListUsersByEmail(decoded);
    console.log(decoded);
    
    // console.log(decoded);
    // console.log(userData);
    if(userData.length){
        gmailWrong = true;
        res.statusCode = 302;
        res.setHeader("Location", "/register");
        res.end();
        return;
    }
    else{
        // newGmailWithGoogle = decoded.email;
      gmailWrong = false;
      session.writeSessionGG(req,res,decoded.email);
      // res.statusCode = 302;
      //   res.setHeader("Location", "/newpassword");
      //   res.end();
      // await userDB.insertUserEmail(decoded);
    } 
  }



  async registerNewPassword(req, res){
    let registerGG ={};
    let emailGG = session.checkingSession(req);
    const inputForm = await this.loadDataInForm(req);
    console.log(inputForm)
    registerGG = {email: emailGG, password: inputForm.password, type: inputForm.type};
    console.log(emailGG);
    console.log(registerGG);
   await userDB.insertUserEmail(registerGG);
    session.deleteSession(req);
   res.statusCode = 302;
        res.setHeader("Location", "/login");
        res.end();

  }

  async checkRegister(req, res) {
    const inputForm = await this.loadDataInForm(req);
    const userData = await userDB.getListUser();
    
    // console.log(inputForm);
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].phone == inputForm.phone) {
        // số điện thoại đã tồn tại
        userWrong = true;
        res.statusCode = 302;
        res.setHeader("Location", "/register");
        res.end();
        return;
      }
      // còn lại thì gọi db và insert dữ liệu vào thôi !!!
    }
    await userDB.insertUser(inputForm);
    userWrong = false;
    res.statusCode = 302;
    res.setHeader("Location", "/login");
    // ở bên front end đã xử lí dữ liệu đầu vào inputForm rồi nên
    // là trong inputForm chắc chắn trả về dữ liệu lên ko cần ktra có rỗng hay không nhé !
    res.end();
  }

  async showNewPasswordPage(req, res) {
    fs.readFile("./src/views/newpassword.html", "utf-8", function (err, data){
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    })

  }
}

module.exports = new AuthController();
