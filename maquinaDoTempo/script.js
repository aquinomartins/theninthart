import { FloatingTimeGuideController } from './scripts/floating-time-guide.js';

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const visualCarousel = document.querySelector('[data-visual-carousel]');
const visualCarouselPrev = document.querySelector('[data-carousel-prev]');
const visualCarouselNext = document.querySelector('[data-carousel-next]');

if (visualCarousel && visualCarouselPrev && visualCarouselNext) {
  const getCarouselStep = () => {
    const firstItem = visualCarousel.querySelector('.visual-carousel-item');
    if (!firstItem) return visualCarousel.clientWidth;

    const carouselStyles = window.getComputedStyle(visualCarousel);
    const carouselGap = parseFloat(carouselStyles.columnGap || carouselStyles.gap) || 0;
    return firstItem.getBoundingClientRect().width + carouselGap;
  };

  visualCarouselPrev.addEventListener('click', () => {
    visualCarousel.scrollBy({ left: -getCarouselStep(), behavior: 'smooth' });
  });

  visualCarouselNext.addEventListener('click', () => {
    visualCarousel.scrollBy({ left: getCarouselStep(), behavior: 'smooth' });
  });
}


const floatingTimeGuide = new FloatingTimeGuideController({
  guide: document.querySelector('[data-floating-time-guide]'),
  destination: document.querySelector('[data-time-machine-destination]'),
  destinationAnchor: document.querySelector('[data-time-machine-guide-anchor]'),
  status: document.querySelector('[data-floating-guide-status]'),
  label: document.querySelector('[data-floating-guide-label]'),
  exclusionSelector: '[data-floating-guide-exclusion]',
  headerSelector: 'header, .experience-header',
  context: 'maquinaDoTempo'
});

floatingTimeGuide.init();
