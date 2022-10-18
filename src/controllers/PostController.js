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
    try {
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
    catch (error) {
      console.log(error.message);
    }
  }

  async createPost(req, res) {
    try {
      // tham khảo của anh Linh về insert copy
      const formInput = await this.loadDataInForm(req);
      const idUser = session.checkingSession(req)[0];
      formInput.inputURL = formInput.inputURL.split(",");
      const currentTime = new Date();
      const queryTime = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1}-${currentTime.getDate()}`;
      const strQuery = `insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
    values('${formInput.inputTitle}',${idUser},'${queryTime}','${formInput.inputAddress}','${formInput.lat}','${formInput.lng}',${formInput.inputPrice},'cho thuê','${formInput.inputAddress}');`;
      const numbPost = await postHouse.getNumberPostDB();
      const newIdPost = Number(numbPost[0].SoLuongPost) + 1;
      await postHouse.createPost(strQuery);
      formInput.inputURL.forEach(async (e) => {
        await postHouse.insertImgData(newIdPost, e);
      });
      res.statusCode = 302;
      res.setHeader("Location", "/category");
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async showDetailPost(req, res) {
    try {
      let isLogin = session.checkingSession(req, res);
      const idPost = url.parse(req.url).query;
      const strPostQuery = `select postId, tUser.userId,title, addressPost, lat,lng,cost,statusHouse,descriptionPost,phone,nameUser from Post join tUser on Post.userId = tUser.userId where postId = ${idPost}`;
      const strImgPostQuery = `select * from Image where postId = ${idPost}`;
      const dataDetailPost = await postHouse.getDataPost(strPostQuery);
      const listImgDetail = await postHouse.getDataPost(strImgPostQuery);
      let htmlImg = "";
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

          data = data.replace(
            `action="/buy-house"`,
            `action="/buy-house?idPost=${idPost}"`
          );
          data = data.replace(
            `action="/buy-house"`,
            `action="/buy-house?idPost=${idPost}"`
          );
          // update info post host
          data = data.replace(`{phone-host}`, dataDetailPost[0].phone);
          data = data.replace("{name-admin-post}", dataDetailPost[0].nameUser);

          // show comment post
          data = data.replace(
            `<form class="comments__form" action="/comment" method="POST">`,
            `<form class="comments__form" action="/comment?idPost=${idPost}&&idUser=${isLogin[0]}" method="POST">`
          );
          const dataComment = await this.showCommentList(idPost, data, req);
          data = data.replace(data, dataComment);
          if (dataDetailPost[0].statusHouse == "Đã thuê") {
            data = data.replace(
              `<button class="btn__toggle-numberphone ms-2" type="submit">Đặt ngay</button>`,
              `<button class="btn__toggle-numberphone ms-2 d-none" type="submit">Đặt ngay</button>`
            );

            data = data.replace(
              `<button class="button__info" type="submit">Bấm để đặt phòng ngay</button>`,
              `<button class="button__info d-none" type="submit">Bấm để đặt phòng ngay</button>`
            );
          }

          if (isLogin[7] == 1) {
            data = data.replace(
              `<button class="btn__toggle-numberphone ms-2" type="submit">Đặt ngay</button>`,
              `<button class="btn__toggle-numberphone ms-2" type="submit" disabled>Đặt ngay</button>`
            );

            data = data.replace(
              `<button class="button__info" type="submit">Bấm để đặt phòng ngay</button>`,
              `<button class="button__info" type="submit" disabled>Bấm để đặt phòng ngay</button>`
            );
          }

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
    catch (error) {
      console.log(error.message);
    }
  }

  async showCategoryPage(req, res) {
    try {
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
        // console.log(postLists)
        // for(let i = 0; i < postLists.length; i++){
        //   console.log(postLists[i].datePost.getMonth() );
        // }
        postLists.forEach((e) => {
          html += `<div class="col-4" data-aos="fade-up">
        <a class="card__house px-3 py-2 d-flex flex-column justify-content-between" style="width: 18rem; height:350px" data-aos="zoom-out-left" href="/detail-post?${e.postId
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
            <span class="card-text-date "><i class="fa-solid fa-clock me-1"></i>${e.datePost.getFullYear()
            }-${e.datePost.getMonth() + 1}-${e.datePost.getDate()}</span>
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
    catch (error) {
      console.log(error.message);
    }
  }

  async showCommentList(idPost, data, req) {
    try {
      const strQuery = `select idComment,tUser.userId,nameUser,content,dateComment from tComment join tUser on tComment.userId = tUser.userId where tComment.postId = ${idPost} order by dateComment desc`;
      const listCommentDB = await postHouse.getListComment(strQuery);
      const currentUserData = await session.checkingSession(req);
      const idCurrentUser = currentUserData[0];
      const nameCurrentUser = currentUserData[1];
      data = data.replace("{name-current-user}", nameCurrentUser);
      let htmlListComment = "";
      listCommentDB.forEach((e) => {
        htmlListComment += `<li class="list__comments-item d-flex align-items-center mt-3">
      <img src="https://muaban.net/images/account/avatar-default.png" alt="" style="border-radius: 50%;" width="5%" height="5%">
      <div class="list__comments-info ms-3">
        <div class="list__comments-name mb-2">${e.nameUser} ${e.userId == idCurrentUser ? "(Bạn)" : ""
          }</div>
        <div class="list__comments-content">${e.content}</div>
      </div>
    </li>
    <div class="date__time-comment mb-3 d-flex justify-content-between">
    ${e.dateComment.toISOString().slice(0, 10)}
    <a class="btn__delete-comment ${e.userId == idCurrentUser ? "" : "d-none"
          } " href="/delete-comment?idComment=${e.idComment
          }&&idPost=${idPost}" style="color:#333;">Xoa</a>
    </div>
    `;
      });

      data = data.replace("{list-comment}", htmlListComment);

      return data;
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async addComment(req, res) {
    try {
      const urlData = url.parse(req.url, true).query;
      const formInput = await this.loadDataInForm(req);
      const currentTime = new Date();
      const queryTime = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1
        }-${currentTime.getDate() + 1}`;
      const strQuery = `insert tComment(userId,postId,content,dateComment) values (${urlData.idUser},${urlData.idPost},'${formInput.commentText}','${queryTime}');`;
      await postHouse.insertCommentDB(strQuery);
      res.statusCode = 302;
      res.setHeader("Location", `/detail-post?${urlData.idPost}`);
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async deleteComment(req, res) {
    try {
      const urlData = url.parse(req.url, true).query;
      await postHouse.deleteComment(urlData.idComment);
      res.statusCode = 302;
      res.setHeader("Location", `/detail-post?${urlData.idPost}`);
      res.end();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async searchingPost(req, res) {
    try {
      let isLogin = session.checkingSession(req, res);
      const inputForm = await this.loadDataInForm(req);
      const postData = await postHouse.getListPost();
      let html = '';
      // console.log(postData);
      for (let i = 0; i < postData.length; i++) {
        if ((postData[i].addressPost).includes(inputForm.province) ||
          (postData[i].statusHouse).includes(inputForm.status) ||
          (postData[i].datePost.toISOString().slice(0, 10)).includes(inputForm.time) ||
          (postData[i].cost <= inputForm.price)) {
          // console.log(e.tatus);

          html += `<div class="col-4" data-aos="fade-up">
        <a class="card__house px-3 py-2 d-flex flex-column justify-content-between" style="width: 18rem; height:350px" data-aos="zoom-out-left" href="/detail-post?${postData[i].postId
            }">
          <div class="card__img" style="width: 100%;
          height: 160px;
          background-image: url('${postData[i].url}');
          background-size: cover;
          border-radius: 10px;
          background-repeat: no-repeat;
          background-position: center;
          ">
          </div>
          <h5 class="card-title mt-2" style="color: #333;">${
            postData[i].title
          }</h5>
          <div class="card__body d-flex flex-column">
          <span class="card-text-address">${postData[i].addressPost} </span>
            <span class="card-text-price">${postData[i].cost} đ</span>
            <span class="card-text-date "><i class="fa-solid fa-clock me-1"></i>${postData[i].datePost.getFullYear()
            }-${postData[i].datePost.getMonth() + 1}-${postData[i].datePost.getDate()}</span>
          </div>
        </a>
      </div>`;
        }
        // console.log(inputForm.time.toISOString().slice(0, 10));

      }

      fs.readFile("./src/views/categorypost.html", "utf-8", async (err, data) => {
        if (err) {
          console.log(err);
        }
        if (isLogin) {
          let newData = await session.changeFontEnd(data, isLogin);
          data = data.replace(data, newData);
        }
        data = data.replace("{PostHouse-Lists}", html);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      })
      // res.end("hi");
    }
    catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new PostController();
