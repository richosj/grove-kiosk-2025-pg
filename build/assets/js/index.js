(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
let currentSlideIndex = 0;
let swiperInstance;
document.addEventListener("DOMContentLoaded", () => {
  const kiosk = document.querySelector(".kiosk");
  const updatePage1Class = () => {
    if (currentSlideIndex === 0) {
      kiosk.classList.add("page1");
    } else {
      kiosk.classList.remove("page1");
    }
  };
  const updateEndClass = () => {
    const lastIndex = swiperInstance.slides.length - 1;
    if (currentSlideIndex === lastIndex) {
      kiosk.classList.add("end");
    } else {
      kiosk.classList.remove("end");
    }
  };
  swiperInstance = new Swiper(".swiper-container", {
    slidesPerView: 1,
    pagination: { el: ".swiper-pagination", clickable: true },
    autoHeight: true,
    initialSlide: 0,
    on: {
      slideChange: function() {
        console.log(this.activeIndex);
      }
    }
  });
  currentSlideIndex = swiperInstance.activeIndex;
  updatePage1Class();
  updateEndClass();
  swiperInstance.on("slideChange", () => {
    currentSlideIndex = swiperInstance.activeIndex;
    updatePage1Class();
    updateEndClass();
  });
  const btnPrev = document.querySelector(".btn-prev");
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      if (currentSlideIndex > 0) {
        swiperInstance.slidePrev();
      }
    });
  }
  const btnNext = document.querySelector(".btn-next");
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (currentSlideIndex < swiperInstance.slides.length - 1) {
        swiperInstance.slideNext();
      }
    });
  }
  const btnHome = document.querySelector(".btn-home");
  if (btnHome) {
    btnHome.addEventListener("click", () => {
      swiperInstance.slideTo(0);
    });
  }
  const openPopup = (popupName) => {
    const popup = document.querySelector(`.${popupName}`);
    if (popup) {
      popup.classList.add("show");
    }
  };
  const closePopup = (popup) => {
    if (popup) {
      popup.classList.remove("show");
    }
  };
  const popupButtons = document.querySelectorAll("[data-popup]");
  popupButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const popupName = btn.getAttribute("data-popup");
      openPopup(popupName);
    });
  });
  const closeButtons = document.querySelectorAll(".btn-close");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const popup = e.target.closest(".popup");
      closePopup(popup);
    });
  });
  const moveButtons = document.querySelectorAll("[data-move]");
  moveButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const slideIndex = btn.getAttribute("data-move");
      if (slideIndex !== "" && !isNaN(slideIndex)) {
        const index = parseInt(slideIndex);
        const popup = btn.closest(".popup");
        if (popup) {
          closePopup(popup);
        }
        swiperInstance.slideTo(index);
      }
    });
  });
});
