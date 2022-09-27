const url = require("url");
const fs = require("fs");
require("dotenv").config();
const PATH = process.env.USER;

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
    switch (path) {
      case "/":
        fs.readFile("./src/views/home.html", "utf-8", function (err, data) {
          if (err) {
            console.log(err.message);
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          return res.end();
        });
        break;
      default:
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>No found page !</h1>");
        return res.end();
    }
  }
}

module.exports = router;
