const inputPassword = document.getElementById("password");
const inputPasswordAgain = document.getElementById("password-again");
const btnChangePassword = document.getElementById("btn-change-password");
const messageType = document.querySelector("#message_type");
const messagePolicy = document.querySelector("#message_policy");
const typeRent = document.querySelector("#type_rent");
const typeHost = document.querySelector("#type_host");
const policy = document.querySelector("#check_policy");
let passwordCheck = "";
let passwordCheckAgain = "";

inputPassword.addEventListener("focusout", (e) => {
  passwordCheck = e.target.value;
  if (passwordCheck == "") {
    setErrorFor(e.target, "Không được để trống trường này !");
  } else if (!isPassWord(passwordCheck)) {
    setErrorFor(e.target, "Trường này không hợp lệ !");
  } else {
    setSuccessFor(e.target);
  }
});

inputPasswordAgain.addEventListener("focusout", (e) => {
  passwordCheckAgain = e.target.value;
  if (passwordCheckAgain == "") {
    setErrorFor(e.target, "Không được để trống trường này !");
  } else if (!isPassWord(passwordCheckAgain)) {
    setErrorFor(e.target, "Trường này không hợp lệ !");
  } else if (passwordCheck != e.target.value) {
    setErrorFor(e.target, "Mật khẩu không khớp !");
  } else {
    setSuccessFor(e.target);
  }
});

btnChangePassword.addEventListener("click", (e) => {
  if (!isPassWord(passwordCheck)) {
    e.preventDefault();
  }
  if (!isPassWord(passwordCheckAgain)) {
    e.preventDefault();
  }
  if (passwordCheck == "" || passwordCheckAgain == "") {
    e.preventDefault();
  }
  if (passwordCheck != passwordCheckAgain) {
    e.preventDefault();
  }
});

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  input.classList.add("inputWrong");
  input.classList.remove("inputSuccess");
  const errorMassage = formControl.querySelector(".message");
  errorMassage.classList.remove("d-none");
  errorMassage.innerText = message;
  errorMassage.classList.add("messageWrong");
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  input.classList.add("inputSuccess");
  input.classList.remove("inputWrong");
  const errorMassage = formControl.querySelector(".message");
  console.log(errorMassage);
  errorMassage.classList.add("d-none");
}

btnChangePassword.addEventListener("click", (e) => {
  if (!typeHost.checked && !typeRent.checked) {
    messageType.classList.remove("d-none");
    e.preventDefault();
  } else if (!policy.checked) {
    messagePolicy.classList.remove("d-none");
    e.preventDefault();
  } else if (passwordCheck == "" || passwordCheckAgain == "") {
    e.preventDefault();
  }
});

typeHost.addEventListener("click", (e) => {
  messageType.classList.add("d-none");
});

typeRent.addEventListener("click", (e) => {
  messageType.classList.add("d-none");
});

messagePolicy.addEventListener("click", (e) => {
  messagePolicy.classList.add("d-none");
});

function isPassWord(passWord) {
  return /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/.test(passWord);
}
