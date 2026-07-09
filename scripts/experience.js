const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else { revealItems.forEach((item) => item.classList.add('is-visible')); }

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const prev = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');
  const dots = carousel.querySelector('[data-dots]');
  const cards = [...track.children];
  let timer;
  const step = () => (cards[0]?.getBoundingClientRect().width || track.clientWidth) + 14;
  const activeIndex = () => Math.round(track.scrollLeft / step());
  const renderDots = () => { dots.innerHTML = ''; cards.forEach((_, index) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `Ir para item ${index + 1}`); b.addEventListener('click', () => { stop(); track.scrollTo({ left: index * step(), behavior: prefersReduced ? 'auto' : 'smooth' }); }); dots.appendChild(b); }); updateDots(); };
  const updateDots = () => [...dots.children].forEach((dot, index) => dot.classList.toggle('is-active', index === activeIndex()));
  const move = (dir) => { stop(); track.scrollBy({ left: dir * step(), behavior: prefersReduced ? 'auto' : 'smooth' }); };
  const play = () => { if (prefersReduced || carousel.dataset.autoplay !== 'true') return; timer = window.setInterval(() => { const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step(), behavior: 'smooth' }); }, 4200); };
  const stop = () => { if (timer) window.clearInterval(timer); };
  prev?.addEventListener('click', () => move(-1)); next?.addEventListener('click', () => move(1));
  track.addEventListener('scroll', () => window.requestAnimationFrame(updateDots));
  carousel.addEventListener('mouseenter', stop); carousel.addEventListener('mouseleave', play);
  carousel.addEventListener('focusin', stop); carousel.addEventListener('touchstart', stop, { passive: true });
  renderDots(); play();
});
