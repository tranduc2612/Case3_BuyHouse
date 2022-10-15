const url = require("url");
const fs = require("fs");
require("dotenv").config();
const siteController = require("../controllers/SiteController");
const authController = require("../controllers/AuthController");
const postController = require("../controllers/PostController");
const PATH = process.env.USER;
const jwt = require("jsonwebtoken");

async function router(req, res) {
  let parseUrl = url.parse(req.url, true);
  let path = parseUrl.pathname;
  let mimeTypes = {
    webp: "image/webp",
    jpg: "images/jpg",
    png: "images/png",
    js: "text/javascript",
    css: "text/css",
    svg: "image/svg+xml",
    ttf: "font/ttf",
    woff: "font/woff",
    woff2: "font/woff2",
    eot: "application/vnd.ms-fontobject",
  };
  const filesDefences = path.match(
    /\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot|\.webp/
  );
  if (filesDefences) {
    const extension = mimeTypes[filesDefences[0].toString().split(".")[1]];
    res.writeHead(200, { "Content-Type": extension });
    fs.createReadStream(PATH + req.url).pipe(res);
  } else {
    let pathToken;
    const token_google = parseUrl.pathname.replace("/", "").split("$")[1];
    decoded = jwt.decode(token_google);
    if (decoded) {
      pathToken = token_google;
    }
    switch (path) {
      case "/":
        siteController.showHomePage(req, res);
        break;
      case "/home":
        siteController.showHomePage(req, res);
        break;
      case "/login":
        if (req.method == "GET") {
          authController.showLoginPage(req, res);
        }
        if (req.method == "POST") {
          authController.checkLogin(req, res);
        }
        break;
      case "/info-user":
        if (req.method == "GET") {
          authController.showInfoUser(req, res);
        }
        if (req.method == "POST") {
          authController.updateInfo(req, res, token_google);
        }
        break;
      case "/log-out":
        authController.logOutUser(req, res);
        break;
      case `/login$${pathToken}`:
        authController.loginWithGoogle(req, res, token_google);
        break;
      case "/register":
        if (req.method == "GET") {
          authController.showRegisterPage(req, res);
        }
        if (req.method == "POST") {
          authController.checkRegister(req, res);
        }
        break;
      case `/register$${pathToken}`:
        authController.registerWithGoogle(req, res, token_google);
        break;
      case "/newpassword":
        if (req.method == "GET") {
          authController.showNewPasswordPage(req, res);
        }
        if (req.method == "POST") {
          authController.registerNewPassword(req, res, token_google);
        }
        break;
      case "/changepassword":
        break;
      case "/category":
        siteController.showCategoryPage(req, res);
        break;
      case "/detail-post":
        siteController.showDetailPost(req, res);
        break;
      case "/create-post":
        if (req.method == "GET") {
          postController.showCreatePost(req, res);
        }
        if (req.method == "POST") {
          postController.createPost(req, res);
        }
        break;
      default:
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>No found page !</h1>");
        return res.end();
    }
  }
}

module.exports = router;
