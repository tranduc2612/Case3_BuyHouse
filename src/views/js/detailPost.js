const btnPost = document.querySelectorAll("[data-carousel-button]");
const btn = document.querySelectorAll(".post__btn-slider");
const btnLike = document.querySelector("#heart__active");
const wrapEmotion = document.querySelector(".wrap__emotion-heart");
const btnComment = document.querySelector(".btn__comment ");
const inputComment = document.querySelector(".input__comment");
btn.forEach((e) => {
  e.addEventListener("click", (j) => {
    j.preventDefault();
  });
});

console.log(btnPost);

btnPost.forEach((button) => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1;
    const slides = button
      .closest("[data-carousel]")
      .querySelector("[data-slides]");

    const activeSlide = slides.querySelector("[data-active]");
    let newIndex = [...slides.children].indexOf(activeSlide) + offset;

    if (newIndex < 0) {
      newIndex = slides.children.length - 1;
    }
    if (newIndex >= slides.children.length) {
      newIndex = 0;
    }
    slides.children[newIndex].dataset.active = true;
    delete activeSlide.dataset.active;
  });
});

btnLike.addEventListener("click", (e) => {
  console.log(wrapEmotion.classList.contains("active"));
  if (wrapEmotion.classList.contains("active")) {
    wrapEmotion.classList.remove("active");
  } else {
    wrapEmotion.classList.add("active");
  }
});

btnComment.addEventListener("click", (e) => {
  if (inputComment.value == "") {
    e.preventDefault();
  }
});
