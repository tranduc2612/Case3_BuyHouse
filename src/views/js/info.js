const btnEdit = document.querySelectorAll(".edit__btn");
const inputForm = document.querySelectorAll(".input__value");
const btnUpdate = document.querySelector(".btn__update");
const inputPhone = document.querySelector(".input__phone");
const inputEmail = document.querySelector(".input__email");
const inputName = document.querySelector(".input__name");
const inputGender = document.querySelector(".input__gender");
const inputAddress = document.querySelector(".input__address");
const inputIdentifier = document.querySelector(".input__identifier");

let prevEmail;
let prevName;
let prevGender;
let prevAddress;
let prevIdentifier;
let currentEmail;
let currentName;
let currentGender;
let currentAddress;
let currentIdentifier;

for (let i = 0; i < btnEdit.length; i++) {
  btnEdit[i].addEventListener("click", (e) => {
    console.log(btnEdit[i]);
    if (inputForm[i].name == "email") {
      prevEmail = inputForm[i].value;
    }
    if (inputForm[i].name == "name") {
      prevName = inputForm[i].value;
    }
    if (inputForm[i].name == "gender") {
      prevGender = inputForm[i].value;
    }
    if (inputForm[i].name == "addressBorn") {
      prevAddressBorn = inputForm[i].value;
    }
    if (inputForm[i].name == "identifier") {
      prevIdentifier = inputForm[i].value;
    }

    if (inputForm[i].disabled) {
      inputForm[i].disabled = false;
      inputForm[i].classList.add("bg-white");
    } else {
      inputForm[i].disabled = true;
      inputForm[i].classList.remove("bg-white");
    }
  });
}

inputEmail.addEventListener("change", (e) => {
  currentEmail = e.target.value;
});

inputName.addEventListener("change", (e) => {
  currentName = e.target.value;
});

inputGender.addEventListener("change", (e) => {
  currentGender = e.target.value;
});

inputAddress.addEventListener("change", (e) => {
  currentAddress = e.target.value;
});

inputIdentifier.addEventListener("change", (e) => {
  currentIdentifier = e.target.value;
});

btnUpdate.addEventListener("click", (e) => {
  if (
    currentEmail == prevEmail &&
    currentName == prevName &&
    currentIdentifier == prevIdentifier &&
    currentAddress == prevAddress &&
    currentGender == prevGender
  ) {
    e.preventDefault();
  }
});
