const fs = require("fs");
const cookie = require("cookie");

class CookieAndSession {
  async writeCookieAndSession(req, res, data) {
    let sessionName = Date.now();
    let dataSession = [...data, sessionName];
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

  async writeSessionGG(req, res, emailGG) {
    let sessionName = Date.now();
    fs.writeFile(
      "src/token/" + sessionName + ".txt",
      JSON.stringify(emailGG),
      (err) => {
        if (err) {
          console.log(err.message);
        }
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("google", JSON.stringify(sessionName), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week
          })
        );
        res.statusCode = 302;
        res.setHeader("Location", "/newpassword");
        res.end();
      }
    );
  }

  checkingSessionGG(req) {
    let cookies = req.headers.cookie
      ? cookie.parse(req.headers.cookie).google
      : "";
    let tokenData = fs.existsSync("src/token/" + cookies + ".txt")
      ? JSON.parse(fs.readFileSync("src/token/" + cookies + ".txt", "utf-8"))
      : false;
    return tokenData;
  }

  overrideSession(req, data) {
    let cookies = req.headers.cookie
      ? cookie.parse(req.headers.cookie).key
      : "";
    fs.writeFile(
      "src/token/" + cookies + ".txt",
      JSON.stringify(data),
      (err) => {
        if (err) {
          console.log(err.message);
        }
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

  async deleteSessionGG(req) {
    let cookies = req.headers.cookie
      ? cookie.parse(req.headers.cookie).google
      : "";
    await fs.unlinkSync("src/token/" + cookies + ".txt");
  }

  async changeFontEnd(data, session) {
    data = data.replace(
      "navbar-nav nav-info-login",
      "navbar-nav nav-info-login d-none"
    );

    if (session[session.length - 2] == true) {
      // neu dang nhap bang google
      data = data.replace("{name-user}", session[1]);
      data = data.replace("{user-name-sidebar}", session[1]);
      data = data.replace(
        `<i class="fa-sharp fa-solid fa-circle-user fs-5"></i>`,
        `<img class="img__user" src="${session[10]}" alt="user_img">`
      );
      data = data.replace(
        `class="side__bar-img" src="https://muaban.net/images/account/avatar-default.png"`,
        `class="side__bar-img" src="${session[10]}" style="border-radius:50%;"`
      );
    } else {
      // dang nhap bang tai khoan trong database
      if (session[1] == null) {
        data = data.replace("{name-user}", session[3]);
        data = data.replace("{user-name-sidebar}", session[3]);
      } else {
        data = data.replace("{name-user}", session[1]);
        data = data.replace("{user-name-sidebar}", session[1]);
      }
    }
    if (session[7] == 0) {
      data = data.replace(
        '<i class="fa-sharp fa-solid fa-pen-to-square"></i> Đăng tin',
        '<i class="fa-solid fa-list"></i> Xem bài đăng'
      );

      data = data.replace(
        'a class="button__post text-center" href="/create-post"',
        'a class="button__post text-center" href="/category"'
      );
    }
    data = data.replace(
      "navbar-nav nav-info-user d-none",
      "navbar-nav nav-info-user"
    );
    return data;
  }
}

module.exports = new CookieAndSession();
