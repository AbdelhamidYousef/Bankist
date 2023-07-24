////////////////////// DOM Elements //////////////////////
//////////////////////////////////////////////////////////

// Header elements
const headerEl = document.getElementById("header"),
  headerNav = document.getElementById("header-nav"),
  headerLogo = document.getElementById("header-logo");
// Modal window elements
const openModalBtns = document.querySelectorAll(".js-open-modal-btn"),
  modalContainer = document.getElementById("modal-container"),
  closeModalBtn = document.getElementById("close-modal-btn");
// Tabs elements
const tabsContainer = document.getElementById("tabs-container"),
  tabs = document.querySelectorAll(".js-tab"),
  tabsContents = document.querySelectorAll(".js-tab-content");
// All sections
const allSections = document.querySelectorAll("section");
// Lazy images
const lazyImgs = document.querySelectorAll("img[data-src]");

////////////////////// Modal Window //////////////////////
/////////////////////////////////////////////////////////

// Functions
const openModal = () => {
  modalContainer.classList.remove("hidden");
};
const closeModal = () => {
  modalContainer.classList.add("hidden");
};

// Event Listeners
openModalBtns.forEach((btn) => btn.addEventListener("click", openModal));

[closeModalBtn, modalContainer].forEach((el) =>
  el.addEventListener("click", closeModal)
);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalContainer.classList.contains("hidden")) {
    closeModal();
  }
});

////////////////////// Relative Links //////////////////////
///////////////////////////////////////////////////////////

document.querySelectorAll("a[href*='#']").forEach((link) =>
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const id = this.getAttribute("href");

    if (id === "#") {
      scrollTo({ top: "0", behavior: "smooth" });
      return;
    }

    document.getElementById(id.slice(1)).scrollIntoView({ behavior: "smooth" });
  })
);

////////////////////// Tabs //////////////////////
/////////////////////////////////////////////////

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".js-tab");
  // Guard clause
  if (!clicked) return;
  // Remove active classes
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContents.forEach((tabContent) =>
    tabContent.classList.remove("operations__content--active")
  );

  // Activate target tab & tab-content
  clicked.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

////////////////////// Menu Fade Animation //////////////////////
////////////////////////////////////////////////////////////////

// Function
function fade(e) {
  // Get & validate target
  const targetLink = e.target.closest(".nav__link");
  if (!targetLink) return;
  // Fade the rest of the header
  headerLogo.style.opacity = this;
  headerNav.querySelectorAll(".nav__link").forEach((link) => {
    if (link !== targetLink) link.style.opacity = this;
  });
}

// Event listeners
headerNav.addEventListener("mouseover", fade.bind(0.5));
headerNav.addEventListener("mouseout", fade.bind(1));

////////////////////// Sticky Header Nav ////////////////////////
////////////////////////////////////////////////////////////////

// Call back function
const stickyNav = function ([entry]) {
  if (!entry.isIntersecting) headerNav.classList.add("sticky");
  else headerNav.classList.remove("sticky");
};

// Intersection observer
new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${getComputedStyle(headerNav).height}`,
}).observe(headerEl);

////////////////////// Reveal Sections ////////////////////////
//////////////////////////////////////////////////////////////

// Callback  function
const revealSection = function ([entry], observer) {
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

// Intersection observer
allSections.forEach((sec) => {
  new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  }).observe(sec);
});

////////////////////// Slider ////////////////////////
/////////////////////////////////////////////////////

const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
