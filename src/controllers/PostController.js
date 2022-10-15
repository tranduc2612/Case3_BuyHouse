const fs = require("fs");
const qs = require("qs");
const url = require("url");
const postHouse = require("../model/PostHouse");
const session = require("../controllers/CookieAndSession");

class PostController {
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

  async showCreatePost(req, res) {
    let isLogin = session.checkingSession(req, res);
    if (isLogin) {
      fs.readFile("./src/views/createpost.html", "utf-8", async (err, data) => {
        if (err) {
          console.log(err.message);
        }
        let newData = await session.changeFontEnd(data, isLogin);
        data = data.replace(data, newData);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      });
    } else {
      res.statusCode = 302;
      res.setHeader("Location", "/login");
      res.end();
    }
  }

  async createPost(req, res) {
    const formInput = await this.loadDataInForm(req);
    const idUser = session.checkingSession(req)[0];
    formInput.inputURL = formInput.inputURL.split(",");
    const currentTime = new Date();
    const queryTime = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}`;
    const strQuery = `insert Post(title,userId,datePost,address,lat,lng,cost,statusHouse,descriptionPost)
    values('${formInput.inputTitle}',${idUser},'${queryTime}','${formInput.inputAddress}','${formInput.lat}','${formInput.lng}',${formInput.inputPrice},'cho thuê','${formInput.inputAddress}');`;
    await postHouse.createPost(strQuery);
    res.statusCode = 302;
    res.setHeader("Location", "/category");
    res.end();
  }

  async showDetailPost(req, res) {
    let isLogin = session.checkingSession(req, res);
    const idPost = url.parse(req.url).query;
    const strPostQuery = `select postId, tUser.userId,title, addressPost, lat,lng,cost,statusHouse,descriptionPost,phone,nameUser from Post join tUser on Post.userId = tUser.userId where postId = ${idPost}`;
    const strImgPostQuery = `select * from Image where postId = ${idPost}`;
    const dataDetailPost = await postHouse.getDataPost(strPostQuery);
    const listImgDetail = await postHouse.getDataPost(strImgPostQuery);
    let htmlImg = "";
    console.log(listImgDetail);
    if (isLogin) {
      fs.readFile("./src/views/postdetail.html", "utf-8", async (err, data) => {
        if (err) {
          console.log(err.message);
        }
        let newData = await session.changeFontEnd(data, isLogin);
        data = data.replace(data, newData);
        // change data post detail
        data = data.replace(
          "{list-img-head}",
          `<li class="post__slider position-absolute" data-active><img src="${listImgDetail[0].url}" alt="#" width="100%" height="500px"></li>`
        );
        for (let i = 1; i < listImgDetail.length; i++) {
          htmlImg += `<li class="post__slider position-absolute"><img src="${listImgDetail[i].url}" alt="#" width="100%" height="500px"></li> `;
        }
        data = data.replace("{list-img}", htmlImg);
        data = data.replace(`{post-detail-title}`, dataDetailPost[0].title);
        data = data.replace(`{post-detail-price}`, dataDetailPost[0].cost);
        data = data.replace(
          `{post-detail-status}`,
          dataDetailPost[0].statusHouse
        );
        data = data.replace(
          `{post-detail-address}`,
          dataDetailPost[0].addressPost
        );
        data = data.replace(
          `{post-detail-description}`,
          dataDetailPost[0].descriptionPost
        );

        data = data.replace(
          `position: {lat:10.771783,lng:106.586605}`,
          `position: {lat:${dataDetailPost[0].lat},lng:${dataDetailPost[0].lng}}`
        );

        data = data.replace(
          `center:new google.maps.LatLng(10.771783,106.586605)`,
          `center:new google.maps.LatLng(${dataDetailPost[0].lat},${dataDetailPost[0].lng})`
        );
        // update info post host
        data = data.replace(`{phone-host}`, dataDetailPost[0].phone);
        data = data.replace("{name-admin-post}", dataDetailPost[0].nameUser);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      });
    } else {
      res.statusCode = 302;
      res.setHeader("Location", "/login");
      res.end();
    }
  }

  async showCategoryPage(req, res) {
    let isLogin = session.checkingSession(req, res);
    fs.readFile("./src/views/categorypost.html", "utf-8", async (err, data) => {
      if (err) {
        console.log(err.message);
      }
      if (isLogin) {
        let newData = await session.changeFontEnd(data, isLogin);
        data = data.replace(data, newData);
      }
      let html = "";
      let postLists = await postHouse.getListPost();
      postLists.forEach((e) => {
        html += `<div class="col-4">
        <a class="card__house px-3 py-2 d-flex flex-column justify-content-between" style="width: 18rem; height:350px" data-aos="zoom-out-left" href="/detail-post?${
          e.postId
        }">
          <div class="card__img" style="width: 100%;
          height: 160px;
          background-image: url('${e.url}');
          background-size: cover;
          border-radius: 10px;
          background-repeat: no-repeat;
          background-position: center;
          ">
          </div>
          <h5 class="card-title mt-2" style="color: #333;">${e.title}</h5>
          <div class="card__body d-flex flex-column">
          <span class="card-text-address">${e.addressPost} </span>
            <span class="card-text-price">${e.cost} đ</span>
            <span class="card-text-date "><i class="fa-solid fa-clock me-1"></i>${e.datePost
              .toISOString()
              .slice(0, 10)}</span>
          </div>
        </a>
      </div>`;
        // console.log((e.datePost).toISOString().slice(0,10))
      });
      data = data.replace("{PostHouse-Lists}", html);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  }
}

module.exports = new PostController();
