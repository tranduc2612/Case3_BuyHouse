const price = document.querySelector(".display__price");
const inputRange = document.querySelector(".input__price-range");
const editBtnPrice = document.querySelector(".input__price-icon");
const inputPriceDetail = document.querySelector(".input__price-detail");
const messagePriceDetail = document.querySelector(".noitice__price-detail");

inputRange.addEventListener("change", (e) => {
  price.value = e.target.value;
});

editBtnPrice.addEventListener("click", (e) => {
  if (inputPriceDetail.disabled) {
    inputPriceDetail.disabled = false;
  } else {
    inputPriceDetail.disabled = true;
  }
});
let prevPrice = 0;

inputPriceDetail.addEventListener("change", (e) => {
  if (e.target.value > 1000000000) {
    price.value = prevPrice;
    e.target.value = prevPrice;
    messagePriceDetail.classList.remove("d-none");
  } else {
    price.value = e.target.value;
    prevPrice = e.target.value;
    messagePriceDetail.classList.add("d-none");
  }
});
