const http = require("http");
const fs = require("fs");
const qs = require("qs");
require("dotenv").config();
const router = require("./src/router/router.js");
const PORT = process.env.PORT || 3000;

const server = http.createServer(router);
server.listen(PORT, () => {
	console.log("listening !" + PORT);
});
