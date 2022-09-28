const phoneInput = document.querySelector(".input__phone");
const passwordInput = document.querySelector(".input__password");

phoneInput.addEventListener("focusout", (e) => {
  let input = e.target.value;
  if (input == "") {
    setErrorFor(e.target, "Không được để trống trường này !");
  } else if (!isPhone(input)) {
    setErrorFor(e.target, "Trường này phải là số !");
  } else {
    setSuccessFor(e.target);
  }
});

passwordInput.addEventListener("focusout", (e) => {
  let input = e.target.value;
  if (input == "") {
    setErrorFor(e.target, "Không được để trống trường này !");
  } else if (!isPassWord(input)) {
    setErrorFor(e.target, "Trường này không hợp lệ !");
  } else {
    setSuccessFor(e.target);
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

function isPassWord(passWord) {
  return /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/.test(passWord);
}

function isPhone(phone) {
  return /^[0-9]*$/.test(phone);
}
