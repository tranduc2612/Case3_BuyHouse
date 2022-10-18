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
    try {
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
    catch (e) {
      console.log(e.message);
    }
  }

  async checkLogin(req, res) {
    try {
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
    catch (e) {
      console.log(e.message);
    }
  }

  async logOutUser(req, res) {
    try {
      await session.deleteSession(req);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      res.end();
    }
    catch (e) {
      console.log(e.message);
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
    try {
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
            `<input class="custom-input input__value input__name" type="text" name="name" value="${isLogin[1] ? isLogin[1] : "Cần được cập nhật"
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
    catch (error) {
      console.log(error.message);
    }
  }

  async updateInfo(req, res, token) {
    try {
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
      console.log(currentData);
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
    catch (error) {
      console.log(error.message);
    }
  }

  async updateNewPassword(req, res) {
    try {
      const inputForm = await this.loadDataInForm(req);
      const idUser = await session.checkingSession(req)[0];
      let strQuery = "update tUser set ";
      if (inputForm.password) {
        strQuery += `passwordUR="${inputForm.password}" where userId=${idUser}`;
      }
      userDB.updateUser(strQuery);
      res.statusCode = 302;
      res.setHeader("Location", "/info-user");
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async showRegisterPage(req, res) {
    try {
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
    catch (error) {
      console.log(error.message);
    }
  }

  async registerWithGoogle(req, res, token) {
    try {
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
    catch (error) {
      console.log(error.message);
    }
  }

  async registerNewPassword(req, res) {
    try {
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
    catch (error) {
      console.log(error.message);
    }
  }

  async checkRegister(req, res) {
    try {
      const inputForm = await this.loadDataInForm(req);
      const userData = await userDB.getListUser();

      // console.log(inputForm);
      let data = {
        phone: inputForm.phone,
        password: inputForm.password,
        type: inputForm.type
      };
      console.log(data);
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

      await userDB.insertUserPhone(data);
      this.userWrong = false;
      res.statusCode = 302;
      res.setHeader("Location", "/login");
      // ở bên front end đã xử lí dữ liệu đầu vào inputForm rồi nên
      // là trong inputForm chắc chắn trả về dữ liệu lên ko cần ktra có rỗng hay không nhé !
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async showNewPasswordPage(req, res) {
    try {
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
    catch (error) {
      console.log(error.message);
    }
  }

  async showChangePassword(req, res) {
    try {
      let isLogin = session.checkingSession(req, res);
      if (isLogin) {
        fs.readFile(
          "./src/views/changepassword.html",
          "utf-8",
          async (err, data) => {
            if (err) {
              console.log(err.message);
            }
            let newData = await session.changeFontEnd(data, isLogin);
            data = data.replace(data, newData);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
          }
        );
      } else {
        res.statusCode = 302;
        res.setHeader("Location", "/info-user");
        res.end();
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async showNotification(req, res) {
    try {
      let isLogin = session.checkingSession(req, res);
      let strQuery = `select idNoti,statusNoti, dateNoti,Post.userId,Noti.idUserRent,Post.postId, addressPost, cost, title, statusHouse,url,tUser.nameUser,nameUserRent from Noti
    join Post on Post.postId = Noti.postId
    join Image on Image.postId = Post.postId
    join tUser on tUser.userId = Post.userId`;
      if (isLogin[7] == 1) {
        strQuery += ` where Post.userId = ${isLogin[0]} `;
      } else {
        strQuery += ` where Noti.idUserRent = ${isLogin[0]} `;
      }
      strQuery += "group by idNoti order by dateNoti desc, idNoti desc";
      const dataNoitice = await userDB.getNotification(strQuery);
      let html = "";
      console.log();
      if (isLogin) {
        fs.readFile(
          "./src/views/managenoitice.html",
          "utf-8",
          async (err, data) => {
            if (err) {
              console.log(err.message);
            }
            let newData = await session.changeFontEnd(data, isLogin);
            dataNoitice.forEach((e) => {
              // let nameUserRent = await userDB.getNotification(
              //   `select nameUser from tUser where userId = ${e.idUserRent}`
              // );
              const get_day_of_time = (d1, d2) => {
                let ms1 = d1.getTime();
                let ms2 = d2.getTime();
                return Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));
              };
              const dateNoti = e.dateNoti;
              const currentTime = new Date();
              // console.log(get_day_of_time(currentTime, dateNoti));
              // 86.400.000 tương đương với 1 ngày
              html += `<li class="noitice__item mt-3 position-relative">
            <a class="noitice__link d-flex align-items-center" href="/detail-post?${e.postId
                }">
                <div class="noitice__wrap d-flex align-items-center">
                    <img src="${e.url}" alt="" width="130" height="130">
                    <div class="wrap ms-4 d-flex flex-column justify-content-between" style="width:625px">
                        <h5 class="noitice__title">${e.title}</h5>
                        <span class="noitice__price fs-5">${e.cost}</span>
                        <span style="color:#333;">${isLogin[7] == 0
                  ? "Chủ nhà: " + e.nameUser
                  : "Khách: " + e.nameUserRent
                }</span>
                        <div class="noitice__status wrapper mt-3 d-flex justify-content-between">
                            <span class="noitice__status">${e.statusNoti}</span>
                            <span class="noitice__time me-4"><i class="fa-solid fa-clock me-2"></i>${e.dateNoti.getDate()}/${e.dateNoti.getMonth() + 1}/${e.dateNoti.getFullYear()}</span>
                        </div>
                    </div>
                </div>
                  

                  <a class="btn btn-success position-absolute end-0 me-4 ${e.statusNoti == "Đang chờ duyệt" && isLogin[0] == e.userId
                  ? ""
                  : "d-none"
                }" href="/accept-req?idNoti=${e.idNoti}&idPost=${e.postId
                }" style="top:20%;width:113px">Chấp nhận</a>
                  <a class="btn btn-danger position-absolute end-0 me-4 ${e.statusNoti == "Đang chờ duyệt" ? "" : "d-none"
                }" href="/deny-req?idNoti=${e.idNoti}&idPost=${e.postId
                }" style="top:${isLogin[7] == 0 ? "40%" : "60%"
                };width:113px">Hủy yêu cầu</a>
                <span class="direct__button-deal ${e.statusNoti == "Đang chờ chốt deal" && isLogin[0] == e.userId
                  ? ""
                  : "d-none"
                }">
                  <a class="btn btn-success position-absolute end-0 me-4" href="/accept-deal?idNoti=${e.idNoti
                }&idPost=${e.postId
                }" style="top:20%;width:113px">Chốt deal</a>
                  <a class="btn  btn-danger position-absolute end-0 me-4" href="/deny-req?idNoti=${e.idNoti
                }&idPost=${e.postId}" style="top:60%;width:113px">Hủy Deal</a>
                </span>

                <a class="btn btn-danger position-absolute end-0 me-4 ${e.statusNoti == "Chốt deal thành công" &&
                  currentTime.getTime() - dateNoti.getTime() > 86400000 &&
                  isLogin[7] == 0
                  ? ""
                  : "d-none"
                }" href="/check-in?idNoti=${e.idNoti}&idPost=${e.postId
                }" style="top:40%;width:113px">Trả phòng</a>
            </a>
        </li>`;
            });
            data = data.replace(data, newData);
            data = data.replace("{list-noitice}", html);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
          }
        );
      } else {
        res.statusCode = 302;
        res.setHeader("Location", "/info-user");
        res.end();
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }

}

module.exports = new AuthController();
