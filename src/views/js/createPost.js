const policy = document.querySelector("#check_policy");
const messagePolicy = document.querySelector("#message_policy");
const messageUrl = document.querySelector("#message_url");
const urlInput = document.querySelector(".input_url");
const messagePhone = document.querySelector("#message_phone");
const phoneInput = document.querySelector(".form__input-phone");
const btnPost = document.querySelector(".btn__post");

btnPost.addEventListener("click", (e) => {
  if (!policy.checked) {
    messagePolicy.classList.remove("d-none");
    e.preventDefault();
  } else {
    messagePolicy.classList.add("d-none");
  }
  if (urlInput.value == "") {
    messageUrl.classList.remove("d-none");
    messageUrl.innerHTML = "Trường này không được để trống !";
    e.preventDefault();
  } else if (!isUrl(urlInput.value)) {
    messageUrl.classList.remove("d-none");
    messageUrl.innerHTML = "Sai định dạng !";
    e.preventDefault();
  } else {
    messageUrl.classList.add("d-none");
  }

  if (phoneInput.value == "") {
    messagePhone.classList.remove("d-none");
    messagePhone.innerHTML = "Trường này không được để trống !";
    e.preventDefault();
  }
});

function isUrl(url) {
  return /(https?:\/\/.*\.(?:png|jpg))/i.test(url);
}
