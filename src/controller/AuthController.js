const fs = require('fs');
const qs = require('qs');
const user = require("../model/UserRenter");
const cookie = require('cookie');

class CookieAndSession {
    async writeCookieAndSession(req, res, data) {
        let sessionName = Date.now()
        let dataSession = [...data, sessionName]
        await fs.writeFile(
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
                        maxAge: 60 * 60 * 24 * 7,
                    })
                )
                res.statusCode = 302
                res.setHeader("Location", "/")
                res.end();
            }
        )
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
            ? cookies.parse(req.headers.cookie).key
            : "";
        await fs.unlinkSync("src/token/" + cookies + ".txt")
    }
}

class AccountController {
    cookieAndSession;
    constructor() {
        this.cookieAndSession = new CookieAndSession();
    }

    async showLoginPage(req, res) {
        let isLogin = this.cookieAndSession.checkingSession(req);
        if (isLogin) {
            res.statusCode = 302;
            res.setHeader("Location", "/profile");
            res.end();
        }
        else {
            await fs.readFile("./src/views/login.html", function (err, data) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end()
            })
        }
    }

    async logOut(req, res) {
        await this.cookieAndSession.deleteSession(req);
        res.statusCode = 302;
        res.setHeader("Location", "/login");
        res.end();
    }

    async loadDataInForm(req) {
        let data = "";
        return new Promise((resolve, reject) => {
            req.on("data", (chunks) => {
                data += chunks;
            })
            req.on("end", () => {
                data = qs.parse(data)
                resolve(data)
            })
            req.on("error", (err) => reject(err))
        })
    }

    async checkLogin(req, res) {
        const inputForm = await this.loadDataInForm(req)
        const userList = await user.getListUsers()
        userList.forEach(async (e) => {
            if (inputForm.sdt == e.phone && inputForm.password == e.passwordUR) {
                let newData = Object.values(e)
                await this.cookieAndSession.writeCookieAndSession(req, res, newData)
            }
        })
    }

    async showRegisterPage(req, res) {
        let isLogin = this.cookieAndSession.checkingSession(req);
        if (isLogin) {
            res.statusCode = 302;
            res.setHeader("Location", "/profile");
            res.end();
        } else {
            await fs.readFile("./src/views/register.html", async (err, data) => {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(data);
                return res.end();
            });
        }
    }

    async showProfilePage(req, res) {
        let isLogin = this.cookieAndSession.checkingSession(req);
        if (isLogin) {
            await fs.readFile(
                "./src/views/profile.html",
                "utf-8",
                function (err, data) {
                    if (err) {
                        console.log(err.message);
                    }
                    data = data.replace("{Your Name !}", isLogin[1]);
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(data);
                    return res.end();
                }
            );
        } else {
            res.statusCode = 302;
            res.setHeader("Location", "/login");
            res.end();
        }
    }

    async showAdminPage(req, res) {
        await fs.readFile("./src/views/admin.html", "utf-8", function (err, data) {
            if (err) {
                console.log(err.message);
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
        });
    }

}

module.exports = {
    CookieAndSession: new CookieAndSession(),
    AccountController: new AccountController(),
};

