const url = require("url");
const fs = require("fs");
require("dotenv").config();
const siteController = require("../controllers/SiteController");
const authController = require("../controllers/AuthController");
const PATH = process.env.USER;
const jwt = require("jsonwebtoken");

function router(req, res) {
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
    const token_google = parseUrl.pathname.replace("/", "");
    decoded = jwt.decode(token_google);
    if (decoded) {
      pathToken = token_google;
    }
    switch (path) {
      case "/":
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
        authController.showInfoUser(req, res);
        break;
      case "/log-out":
        authController.logOutUser(req, res);
        break;
      case `/${pathToken}`:
        authController.loginWithGoogle(req, res, token_google);
        break;
      default:
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>No found page !</h1>");
        return res.end();
    }
  }
}

module.exports = router;
