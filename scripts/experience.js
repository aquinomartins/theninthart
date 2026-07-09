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
    text: 'A sequência organiza painéis, intervalos e transições como uma estrutura navegável de leitura, memória e participação.',
    image: 'images/system-sequence.jpg',
    alt: 'Composição visual sobre sequência na Nona Arte'
  },
  rhythm: {
    title: 'O ritmo nasce da distância entre os quadros.',
    text: 'Cada pausa, repetição e avanço cria uma cadência visual que conduz o leitor entre tempo, espaço e ação.',
    image: 'images/system-rhythm.jpg',
    alt: 'Composição visual sobre ritmo, intervalos e sarjetas'
  },
  archive: {
    title: 'Cada estado pode ser preservado, retomado e reorganizado.',
    text: 'A obra deixa de ser uma superfície fixa e passa a funcionar como arquivo vivo de versões, escolhas e percursos.',
    image: 'images/system-archive.jpg',
    alt: 'Composição visual sobre arquivo, memória e estados narrativos'
  },
  research: {
    title: 'A Nona Arte como sistema de investigação.',
    text: 'Diagramas, páginas, interfaces e mecanismos tornam-se instrumentos para estudar linguagem visual, interação e cultura.',
    image: 'images/system-research.jpg',
    alt: 'Composição visual sobre pesquisa, diagramas e linguagem visual'
  },
  interaction: {
    title: 'O leitor deixa rastros na estrutura da obra.',
    text: 'A participação transforma a página em ambiente: cada clique pode revelar, recombinar ou deslocar estados narrativos.',
    image: 'images/system-interaction.jpg',
    alt: 'Composição visual sobre interação e participação do leitor'
  }
};

const systemDetail = document.querySelector('.system-detail');

if (systemDetail) {
  const pills = [...systemDetail.querySelectorAll('[data-detail]')];
  const title = systemDetail.querySelector('[data-detail-title]');
  const text = systemDetail.querySelector('[data-detail-text]');
  const image = systemDetail.querySelector('[data-detail-image]');
  let changeTimer;

  const showPlaceholder = () => systemDetail.classList.add('has-placeholder');
  const showImage = () => systemDetail.classList.remove('has-placeholder');

  systemDetail.dataset.detailState = 'sequence';
  image.addEventListener('error', showPlaceholder);
  image.addEventListener('load', showImage);

  if (!image.complete || image.naturalWidth === 0) {
    showPlaceholder();
  }

  const selectDetail = (pill) => {
    const key = pill.dataset.detail;
    const data = systemDetailData[key];

    if (!data || pill.classList.contains('is-active')) return;

    pills.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
      item.tabIndex = -1;
    });

    pill.classList.add('is-active');
    pill.setAttribute('aria-selected', 'true');
    pill.tabIndex = 0;
    systemDetail.classList.add('is-changing');
    window.clearTimeout(changeTimer);

    changeTimer = window.setTimeout(() => {
      title.textContent = data.title;
      text.textContent = data.text;
      systemDetail.dataset.detailState = key;
      systemDetail.classList.remove('has-placeholder');
      image.src = data.image;
      image.alt = data.alt;
      systemDetail.classList.remove('is-changing');
    }, prefersReduced ? 0 : 180);
  };

  pills.forEach((pill, index) => {
    pill.setAttribute('role', 'tab');
    pill.setAttribute('aria-selected', pill.classList.contains('is-active') ? 'true' : 'false');
    pill.tabIndex = pill.classList.contains('is-active') ? 0 : -1;

    pill.addEventListener('click', () => selectDetail(pill));
    pill.addEventListener('keydown', (event) => {
      const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;

      if (!direction) return;

      event.preventDefault();
      const nextPill = pills[(index + direction + pills.length) % pills.length];
      nextPill.focus();
      selectDetail(nextPill);
    });
  });
}
