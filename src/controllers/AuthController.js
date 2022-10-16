const fs = require("fs");
const qs = require("qs");
const userDB = require("../model/User");
const session = require("./CookieAndSession");
const jwt = require("jsonwebtoken");

class AuthController {
  userWrong;
  gmailWrong;
  constructor() {
    this.userWrong = false;
    this.gmailWrong = false;
  }
  async showLoginPage(req, res) {
    fs.readFile("./src/views/login.html", "utf-8", (err, data) => {
      if (err) {
        console.log(err.message);
      }
      if (this.userWrong == true) {
        data = data.replace(
          "input__phone custom-input p-2",
          "input__phone custom-input p-2 inputWrong"
        );

        data = data.replace(
          `<span class="message d-none"></span>`,
          `<span class="message messageWrong">Số điện thoại sai hoặc không tồn tại !</span>`
        );
        this.userWrong = false;
      }
      if (this.gmailWrong == true) {
        data = data.replace(
          "input__phone custom-input p-2",
          "input__phone custom-input p-2 inputWrong"
        );

        data = data.replace(
          `<span class="message d-none"></span>`,
          `<span class="message messageWrong">Gmail này chưa được đăng kí !</span>`
        );
        this.gmailWrong = false;
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
          userData[i].gender,
          "",
          userData.passwordUR,
          false,
        ];
        this.userWrong = false;
        session.writeCookieAndSession(req, res, newData);
        return;
      }
    }
    this.userWrong = true;
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
            userData[i].gender,
            decoded.picture,
            userData.passwordUR,
            true,
          ];
          this.gmailWrong = false;
          session.writeCookieAndSession(req, res, newData);
          return;
        }
      }
      this.gmailWrong = true;
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
        data = data.replace(
          `<input class="custom-input input__value input__name" type="text" name="name" value="Trần Minh Đức" disabled>`,
          `<input class="custom-input input__value input__name" type="text" name="name" value="${
            isLogin[1] ? isLogin[1] : "Cần được cập nhật"
          }" disabled>`
        );
        if (isLogin[9] == "nam") {
          data = data.replace(
            '<option value="nam">Nam</option>',
            '<option value="nam" selected>Nam</option>'
          );
        } else if (isLogin[9] == "nu") {
          data = data.replace(
            '<option value="nu">Nữ</option>',
            '<option value="nu" selected>Nữ</option>'
          );
        } else if (isLogin[9] == "gioitinhkhac") {
          data = data.replace(
            '<option value="gioitinhkhac">giới tính khác</option>',
            '<option value="gioitinhkhac" selected>giới tính khác</option>'
          );
        }

        if (isLogin[2]) {
          data = data.replace(
            '<input class="custom-input input__value input__address" type="text" name="addressBorn" value="Cần cập nhật" disabled>',
            `<input class="custom-input input__value input__address" type="text" name="addressBorn" value="${isLogin[2]}" disabled>`
          );
        }

        if (isLogin[6]) {
          data = data.replace(
            '<input class="custom-input input__value input__identifier" type="text" name="identifier" value="##########" disabled>',
            `<input class="custom-input input__value input__identifier" type="text" name="identifier" value="${isLogin[6]}" disabled>`
          );
        }

        if (isLogin[5]) {
          data = data.replace(
            '<input class="custom-input input__email" type="text" name="email" value="Cần Được cập nhât" disabled>',
            `<input class="custom-input input__email" type="text" name="email" value="${isLogin[5]}" disabled>`
          );
        }

        if (isLogin[3]) {
          data = data.replace(
            '<input class="custom-input input__phone" type="text" name="phone" value="" disabled>',
            `<input class="custom-input input__phone" type="text" name="phone" value="${isLogin[3]}" disabled>`
          );
        }
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

  async updateInfo(req, res, token) {
    const decoded = jwt.decode(token);
    const userData = await userDB.getListUser();
    const inputForm = await this.loadDataInForm(req);
    const idUser = await session.checkingSession(req)[0];
    let strQuery = "update tUser set ";
    
    let currentData = [
      userData[idUser - 1].userId,
      userData[idUser - 1].nameUser,
      userData[idUser - 1].address,
      userData[idUser - 1].phone,
      userData[idUser - 1].password,
      userData[idUser - 1].email,
      userData[idUser - 1].cccd,
      +userData[idUser - 1].typeDK.toString("hex"),
      userData[idUser - 1].dateDK,
      userData[idUser - 1].gender,
      decoded ? decoded.picture : "",
      userData.passwordUR,
      false,
    ];
    console.log(currentData)
    if (inputForm.gender) {
      
      strQuery += `,gender = '${inputForm.gender}'`;
      
      currentData[9] = inputForm.gender;
    }

    if (inputForm.name) {
      strQuery += `,nameUser = '${inputForm.name}'`;
     
      currentData[1] = inputForm.name;
    }

    if (inputForm.addressBorn) {
      strQuery += `,address = '${inputForm.addressBorn}'`;
      currentData[2] = inputForm.addressBorn;
    }

    if (inputForm.identifier) {
      strQuery += `,cccd = '${inputForm.identifier}'`;
      currentData[6] = inputForm.identifier;
    }
    strQuery += ` where userId = ${idUser};`;
    strQuery = strQuery.replace("set ,", "set ");
    
    session.overrideSession(req, currentData);
    userDB.updateUser(strQuery);
    res.statusCode = 302;
    res.setHeader("Location", "/info-user");
    
    res.end();
  }

  async updateNewPassword(req,res){
    const inputForm = await this.loadDataInForm(req);
    const idUser = await session.checkingSession(req)[0];
    let strQuery = "update tUser set ";
    // console.log(userData);
    if(inputForm.password){
      strQuery += `passwordUR="${inputForm.password}" where userId=${idUser}`;
      // console.log(strQuery);
    }
    userDB.updateUser(strQuery);
    res.statusCode = 302;
    res.setHeader("Location", "/info-user");
    res.end();
  }

  async showRegisterPage(req, res) {
    fs.readFile("./src/views/register.html", "utf-8", (err, data) => {
      if (err) {
        console.log(err.message);
      }
      if (session.checkingSessionGG(req)) {
        session.deleteSessionGG(req);
      }
      if (this.userWrong == true) {
        data = data.replace(
          "input__phone custom-input p-2",
          "input__phone custom-input p-2 inputWrong"
        );

        data = data.replace(
          `<span class="message d-none"></span>`,
          `<span class="message messageWrong">Số điện thoại đã tồn tại !</span>`
        );
        this.userWrong = false;
      }
      if (this.gmailWrong == true) {
        data = data.replace(
          "input__phone custom-input p-2",
          "input__phone custom-input p-2 inputWrong"
        );

        data = data.replace(
          `<span class="message d-none"></span>`,
          `<span class="message messageWrong">Gmail đã được sử dụng!</span>`
        );
        this.gmailWrong = false;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }

  async registerWithGoogle(req, res, token) {
    const decoded = jwt.decode(token);
    const userData = await userDB.getListUsersByEmail(decoded);
    if (userData.length) {
      this.gmailWrong = true;
      res.statusCode = 302;
      res.setHeader("Location", "/register");
      res.end();
    } else {
      this.gmailWrong = false;
      session.writeSessionGG(req, res, decoded.email);
    }
  }

  async registerNewPassword(req, res) {
    let registerGG = {};
    let emailGG = session.checkingSessionGG(req);
    const inputForm = await this.loadDataInForm(req);
    registerGG = {
      email: emailGG,
      password: inputForm.password,
      type: inputForm.type,
    };
    await userDB.insertUserEmail(registerGG);
    session.deleteSessionGG(req);
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
        this.userWrong = true;
        res.statusCode = 302;
        res.setHeader("Location", "/register");
        res.end();
        return;
      }
      // còn lại thì gọi db và insert dữ liệu vào thôi !!!
    }
    await userDB.insertUser(inputForm);
    this.userWrong = false;
    res.statusCode = 302;
    res.setHeader("Location", "/login");
    // ở bên front end đã xử lí dữ liệu đầu vào inputForm rồi nên
    // là trong inputForm chắc chắn trả về dữ liệu lên ko cần ktra có rỗng hay không nhé !
    res.end();
  }

  async showNewPasswordPage(req, res) {
    let emailGG = session.checkingSessionGG(req);
    if (emailGG) {
      fs.readFile(
        "./src/views/newpassword.html",
        "utf-8",
        function (err, data) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
          return;
        }
      );
    } else {
      res.statusCode = 302;
      res.setHeader("Location", "/login");
      res.end();
    }
  }

  async showChangePassword(req, res) {
    let isLogin = session.checkingSession(req, res);
    if (isLogin) {
      fs.readFile("./src/views/changepassword.html", "utf-8", async (err, data) => {
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
      res.setHeader("Location", "/info-user");
      res.end();
    }
  }
}

module.exports = new AuthController();
