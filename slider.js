

  // Card swiper
var swiper = new Swiper(".card-swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
  });

  //  Award swiper
  var swiper = new Swiper(".award-slider", {
    slidesPerView: 3,
    spaceBetween: 2,
    loop:true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 1,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 2,
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 2,
      },
    },
  });

  // Quote swiper
  var swiper = new Swiper(".quoteSlider", {});

  // customer slider

  var swiper = new Swiper(".customer-slider", {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 1,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 1,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 1,
      },
    },
  });