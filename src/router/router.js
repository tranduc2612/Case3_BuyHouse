const url = require("url");
const fs = require("fs");
require("dotenv").config();
const pathConnect = require("path");
const formidable = require("formidable");
const siteController = require("../controllers/SiteController");
const authController = require("../controllers/AuthController");
const postController = require("../controllers/PostController");
const houseController = require("../controllers/HouseController");
const PATH = process.env.USER;
const jwt = require("jsonwebtoken");

async function upLoadFile(req, res) {
  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      const dataImgInput = JSON.parse(
        JSON.stringify({ fields, files }, null, 2)
      ).files.multipleFiles;
      let urlImg = [];
      dataImgInput.forEach((e) => {
        let tmpPath = e.filepath;
        let newPath = pathConnect.join(
          __dirname,
          "..",
          "views",
          "img",
          "img_post",
          e.originalFilename
        );
        urlImg.push(newPath);
        fs.readFile(newPath, (err) => {
          if (err) {
            fs.copyFile(tmpPath, newPath, (err) => {
              if (err) throw err;
            });
          }
        });
      });
      resolve(urlImg);
    });
  });
}

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
      case "/change-password":
        if (req.method == "GET") {
          authController.showChangePassword(req, res);
        }
        if (req.method == "POST") {
          authController.updateNewPassword(req, res);
        }
        break;
      case "/category":
        if (req.method == "GET") {
          postController.showCategoryPage(req, res);
        }
        if (req.method == "POST") {
          postController.searchingPost(req, res);
        }
        break;
      case "/detail-post":
        postController.showDetailPost(req, res);
        break;
      case "/create-post":
        if (req.method == "GET") {
          postController.showCreatePost(req, res);
        }
        if (req.method == "POST") {
          const dataImg = await upLoadFile(req, res);
          postController.createPost(req, res, dataImg);
        }
        break;
      case "/comment":
        postController.addComment(req, res);
        break;
      case "/delete-comment":
        postController.deleteComment(req, res);
        break;
      case "/notification":
        authController.showNotification(req, res);
        break;
      case "/buy-house":
        if (req.method === "POST") {
          houseController.buyHouse(req, res);
        }
        break;
      case "/accept-req":
        houseController.acceptReq(req, res);
        break;
      case "/deny-req":
        houseController.denyReq(req, res);
        break;
      case "/accept-deal":
        houseController.acceptDeal(req, res);
        break;
      case "/check-in":
        houseController.checkInHouse(req, res);
        break;
      default:
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>No found page !</h1>");
        return res.end();
    }
  }
}

module.exports = router;
