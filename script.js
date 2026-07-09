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
const visualCarouselDots = document.querySelector('[data-carousel-dots]');

if (visualCarousel && visualCarouselPrev && visualCarouselNext) {
  const carouselItems = Array.from(visualCarousel.querySelectorAll('.visual-carousel-item'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const autoplayDelay = 4500;
  const resumeDelay = 2500;
  let currentIndex = 0;
  let autoplayId;
  let resumeId;
  let scrollId;
  let dots = [];

  const normalizeIndex = (index) => (index + carouselItems.length) % carouselItems.length;

  const updateDots = () => {
    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  const goToSlide = (index, behavior = 'smooth') => {
    if (!carouselItems.length) return;

    currentIndex = normalizeIndex(index);
    visualCarousel.scrollTo({
      left: carouselItems[currentIndex].offsetLeft - visualCarousel.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : behavior,
    });
    updateDots();
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplayId);
    window.clearTimeout(resumeId);
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (prefersReducedMotion || carouselItems.length < 2) return;

    autoplayId = window.setInterval(() => {
      goToSlide(currentIndex + 1);
    }, autoplayDelay);
  };

  const scheduleAutoplay = () => {
    stopAutoplay();
    if (prefersReducedMotion) return;
    resumeId = window.setTimeout(startAutoplay, resumeDelay);
  };

  const syncActiveSlide = () => {
    const carouselLeft = visualCarousel.getBoundingClientRect().left;
    const closestIndex = carouselItems.reduce((closest, item, index) => {
      const distance = Math.abs(item.getBoundingClientRect().left - carouselLeft);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: currentIndex, distance: Infinity }).index;

    if (closestIndex !== currentIndex) {
      currentIndex = closestIndex;
      updateDots();
    }
  };

  if (visualCarouselDots && carouselItems.length) {
    visualCarouselDots.textContent = '';
    dots = carouselItems.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'visual-carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        stopAutoplay();
        goToSlide(index);
        scheduleAutoplay();
      });
      visualCarouselDots.appendChild(dot);
      return dot;
    });
  }

  visualCarouselPrev.addEventListener('click', () => {
    stopAutoplay();
    goToSlide(currentIndex - 1);
    scheduleAutoplay();
  });

  visualCarouselNext.addEventListener('click', () => {
    stopAutoplay();
    goToSlide(currentIndex + 1);
    scheduleAutoplay();
  });

  visualCarousel.addEventListener('mouseenter', stopAutoplay);
  visualCarousel.addEventListener('mouseleave', scheduleAutoplay);
  visualCarousel.addEventListener('touchstart', stopAutoplay, { passive: true });
  visualCarousel.addEventListener('touchend', scheduleAutoplay);
  visualCarousel.addEventListener('pointerdown', stopAutoplay);
  visualCarousel.addEventListener('pointerup', scheduleAutoplay);
  visualCarousel.addEventListener('scroll', () => {
    window.clearTimeout(scrollId);
    scrollId = window.setTimeout(syncActiveSlide, 90);
  }, { passive: true });

  updateDots();
  startAutoplay();
}
