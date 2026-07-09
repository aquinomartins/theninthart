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

const systemDetailData = {
  sequence: {
    title: 'Uma gramática visual feita de camadas editáveis.',
    text: 'A sequência organiza painéis, intervalos e transições como uma estrutura navegável de leitura, memória e participação.'
  },
  rhythm: {
    title: 'O ritmo nasce da distância entre os quadros.',
    text: 'Cada pausa, repetição e avanço cria uma cadência visual que conduz o leitor entre tempo, espaço e ação.'
  },
  archive: {
    title: 'Cada estado pode ser preservado, retomado e reorganizado.',
    text: 'A obra deixa de ser uma superfície fixa e passa a funcionar como arquivo vivo de versões, escolhas e percursos.'
  },
  research: {
    title: 'A Nona Arte como sistema de investigação.',
    text: 'Diagramas, páginas, interfaces e mecanismos tornam-se instrumentos para estudar linguagem visual, interação e cultura.'
  },
  interaction: {
    title: 'O leitor deixa rastros na estrutura da obra.',
    text: 'A participação transforma a página em ambiente: cada clique pode revelar, recombinar ou deslocar estados narrativos.'
  }
};

const systemDetail = document.querySelector('[data-system-detail]');

if (systemDetail) {
  const pills = systemDetail.querySelectorAll('[data-detail]');
  const figures = systemDetail.querySelectorAll('[data-detail-figure]');
  const title = systemDetail.querySelector('[data-detail-title]');
  const text = systemDetail.querySelector('[data-detail-text]');

  function setSystemDetail(key) {
    const data = systemDetailData[key];
    if (!data) return;

    pills.forEach((pill) => {
      const isActive = pill.dataset.detail === key;
      pill.classList.toggle('is-active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    figures.forEach((figure) => {
      figure.classList.toggle('is-active', figure.dataset.detailFigure === key);
    });

    title.textContent = data.title;
    text.textContent = data.text;
  }

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setSystemDetail(pill.dataset.detail);
    });
  });
}
