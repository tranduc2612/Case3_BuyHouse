const http = require("http");
const fs = require("fs");
const qs = require("qs");
require("dotenv").config();
const router = require("./src/Router/Router.js");
const PORT = process.env.PORT;

const server = http.createServer(router);
server.listen(PORT, () => {
  console.log("listening !");
});
