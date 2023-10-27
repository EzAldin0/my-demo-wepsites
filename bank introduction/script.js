'use strict';
/// Selected Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const scrollTObtn = document.querySelector('.btn--scroll-to');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const cookiesMessage = document.createElement('div');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
////////////////////////////////////////////
//cookie message........

cookiesMessage.classList.add('cookie-message');
cookiesMessage.innerHTML =
  'Do You Accept The Cookies?. <button class="btn btn--close--cookie">Got it!<button>';
header.append(cookiesMessage);
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    cookiesMessage.remove();
  });
cookiesMessage.style.backgroundColor = 'red';
cookiesMessage.style.width = '120%';
cookiesMessage.style.fontSize = '30px';
cookiesMessage.style.color = 'white';
cookiesMessage.style.height =
  Number.parseFloat(getComputedStyle(cookiesMessage).height, 10) + 40 + 'px';
// console.log(getComputedStyle(cookiesMessage).fontSize);
// console.log(getComputedStyle(cookiesMessage).color);
////////////////////////////////////////////
//scrolling ...........
scrollTObtn.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});
////////////////////////////////////////////
// Navagation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tabsContainer.addEventListener('click', function (e) {
  const clickedT = e.target.closest('.operations__tab');

  if (!clickedT) return;
  // Remove Active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));

  //add active class to clicked
  clickedT.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clickedT.dataset.tab}`)
    .classList.add('operations__content--active');
});
///////////////////////////////////////

// handle hover
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const allLinks = link.closest('.nav').querySelectorAll('.nav__link');
    allLinks.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
////////////////////////////

//NAVSticky
const headerhigh = nav.getBoundingClientRect().height;

const callbackFunction = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${headerhigh}px`,
};
const navObserver = new IntersectionObserver(callbackFunction, options);
navObserver.observe(header);

/// Reveal sections:

const allSections = document.querySelectorAll('.section');
const secRev = function (entries, observer) {
  const [enty] = entries;

  if (!enty.isIntersecting) return;

  enty.target.classList.remove('section--hidden');

  observer.unobserve(enty.target);
};
const sectionReveal = new IntersectionObserver(secRev, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(sec => {
  sectionReveal.observe(sec);
  sec.classList.add('section--hidden');
});

/// lazy img
const lazyimgs = document.querySelectorAll('img[data-src]');
const imgRev = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgRevObs = new IntersectionObserver(imgRev, {
  root: null,
  threshold: 0,
  rootMargin: '-10px',
});
lazyimgs.forEach(img => imgRevObs.observe(img));
/////////////////////////

// Sliderrrrrrrrrrrr
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // const sliderr = document.querySelector('.slider');
  // sliderr.style.transform = 'scale(0.3) translateX(-800px)';
  // sliderr.style.overflow = 'visible';
  const createDots = function (slide) {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activatedDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const moveSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  };

  const init = function () {
    createDots();
    activatedDot(0);
    moveSlide(0);
  };
  init();
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    moveSlide(curSlide);
    activatedDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    moveSlide(curSlide);
    activatedDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      moveSlide(slide);
      activatedDot(slide);
    }
  });
};
slider()
///////////////////////////////////////
