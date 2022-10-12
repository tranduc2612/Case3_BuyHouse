const fs = requires('fs');
const qs = require('qs');
const url = require('url');
const postHouse = require('./model/PostHouse');
const session = require("./CookieAndSession");


class PostController{
    async loadDataInForm(req) {
        let data = "";
        return new Promise((resolve, reject) => {
          req.on("data", (chunks) => {
            data += chunks;
          });
          req.on("end", () => {
            data = qs.parse(data);
            resolve(data);
          });
          req.on("error", (err) => {
            reject(err);
          });
        });
    }


}