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

// slider

const sliderContainer = document.querySelector(".slider");
const sliderImgs = document.querySelectorAll(".slider__img");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
let counter = 1;

const size = sliderImgs[0].clientWidth;
sliderContainer.style.transform = "translateX(" + -size * counter + "px)";

nextBtn.addEventListener("click", (e) => {
  if (counter >= sliderImgs.length - 1) {
    return;
  }
  sliderContainer.style.transition = "transform 0.4s ease-in-out";
  counter++;
  console.log(counter);
  sliderContainer.style.transform = "translateX(" + -size * counter + "px)";
});

prevBtn.addEventListener("click", (e) => {
  if (counter <= 0) {
    return;
  }
  sliderContainer.style.transition = "transform 0.4s ease-in-out";
  counter--;
  sliderContainer.style.transform = "translateX(" + -size * counter + "px)";
});

sliderContainer.addEventListener("transitionend", () => {
  if (sliderImgs[counter].id == "lastClone") {
    sliderContainer.style.transition = "none";
    counter = sliderImgs.length - 2;
    sliderContainer.style.transform = "translateX(" + -size * counter + "px)";
  }

  if (sliderImgs[counter].id == "firstClone") {
    sliderContainer.style.transition = "none";
    counter = sliderImgs.length - counter;
    sliderContainer.style.transform = "translateX(" + -size * counter + "px)";
  }
});
