const { log } = require('console');
const fs = require('fs');
const { resolve } = require('path');
const qs = require('qs');
const AccountController = require('../controller/AuthController.js');
const user = require('../model/UserRenter');
const cookieAndSession = AccountController.CookieAndSession;

class SiteController {
    async showHomePage(req,res) {
        let isLogin = cookieAndSession.checkingSession(req);
        await fs.readFile("./src/views/home.html","utf-8",(err,data)=>{
            if(err) {
                console.log(err.message);
            }
            if(isLogin){
                data = data.replace("header__user-login","header__user-login d-none")
                data = data.replace("header__user-register","header__user-register hidden")
                data = data.replace("header__user-auth hidden","header__user-auth")
                data = data.replace("Cá nhân",isLogin[1])
            }
            res.writeHead(200,{ "Content-Type": "text/html"})
            res.write(data)
            return res.end()
        })
    }

    
}

module.exports = new SiteController();