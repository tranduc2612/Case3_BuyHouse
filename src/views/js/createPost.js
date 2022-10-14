const policy = document.querySelector("#check_policy");
const messagePolicy = document.querySelector("#message_policy");
const messageUrl = document.querySelector("#message_url");
const urlInput = document.querySelector(".input_url");
const btnPost = document.querySelector(".btn__post");

btnPost.addEventListener("click", (e) => {
  if (!policy.checked) {
    messagePolicy.classList.remove("d-none");
    e.preventDefault();
  }
  if (urlInput.value == "") {
    messageUrl.classList.remove("d-none");
    e.preventDefault();
  }
});
