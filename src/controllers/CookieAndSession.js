const fs = require("fs");
const cookie = require("cookie");

class CookieAndSession {
  async writeCookieAndSession(req, res, data) {
    let sessionName = Date.now();
    let dataSession = [...data];
    fs.writeFile(
      "src/token/" + sessionName + ".txt",
      JSON.stringify(dataSession),
      (err) => {
        if (err) {
          console.log(err.message);
        }
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("key", JSON.stringify(sessionName), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week
          })
        );
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      }
    );
  }

  checkingSession(req) {
    let cookies = req.headers.cookie
      ? cookie.parse(req.headers.cookie).key
      : "";
    let tokenData = fs.existsSync("src/token/" + cookies + ".txt")
      ? JSON.parse(fs.readFileSync("src/token/" + cookies + ".txt", "utf-8"))
      : false;
    return tokenData;
  }

  async deleteSession(req) {
    let cookies = req.headers.cookie
      ? cookie.parse(req.headers.cookie).key
      : "";
    await fs.unlinkSync("src/token/" + cookies + ".txt");
  }

  async changeFontEnd(data, session) {
    data = data.replace(
      "navbar-nav nav-info-login",
      "navbar-nav nav-info-login d-none"
    );

    if (session[session.length - 1] == true) {
      // neu dang nhap bang google
      data = data.replace("{name-user}", session[2]);
      data = data.replace("{user-name-sidebar}", session[2]);
      data = data.replace(
        `<i class="fa-sharp fa-solid fa-circle-user fs-5"></i>`,
        `<img class="img__user" src="${session[4]}" alt="user_img">`
      );
      data = data.replace(
        `class="side__bar-img" src="https://muaban.net/images/account/avatar-default.png"`,
        `class="side__bar-img" src="${session[4]}" style="border-radius:50%;"`
      );
    } else {
      // dang nhap bang tai khoan trong database
      if (session[2] == null) {
        data = data.replace("{name-user}", session[4]);
        data = data.replace("{user-name-sidebar}", session[4]);
      } else {
        data = data.replace("{name-user}", session[2]);
        data = data.replace("{user-name-sidebar}", session[2]);
      }
    }

    data = data.replace(
      "navbar-nav nav-info-user d-none",
      "navbar-nav nav-info-user"
    );
    return data;
  }
}

module.exports = new CookieAndSession();
