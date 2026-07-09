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
    title: 'A sequência organiza a leitura como estrutura navegável.',
    text: 'Painéis, intervalos e transições compõem uma ordem visual que orienta o percurso do leitor.',
    image: 'images/imagem1.png',
    caption: 'Sequência, painéis e transição.'
  },
  rhythm: {
    title: 'O ritmo cria cadência entre pausa, leitura e avanço.',
    text: 'A repetição, o espaçamento e a alternância visual modulam o tempo de leitura.',
    image: 'images/imagem2.png',
    caption: 'Ritmo visual, pausa e cadência.'
  },
  archive: {
    title: 'O arquivo guarda estados possíveis da obra.',
    text: 'A memória visual permite recuperar, recombinar e reorganizar estados narrativos.',
    image: 'images/imagem3.png',
    caption: 'Arquivo, memória e estados narrativos.'
  },
  research: {
    title: 'A pesquisa transforma a página em diagrama.',
    text: 'A obra pode operar como campo de investigação, anotação, comparação e descoberta.',
    image: 'images/imagem4.png',
    caption: 'Pesquisa, diagrama e linguagem visual.'
  },
  interaction: {
    title: 'O leitor deixa rastros na estrutura da obra.',
    text: 'A participação transforma a página em ambiente: cada clique pode revelar, recombinar ou deslocar estados narrativos.',
    image: 'images/imagem5.png',
    caption: 'Participação, clique e interação.'
  }
};

const systemDetailRoot = document.querySelector('[data-system-detail]');

if (systemDetailRoot) {
  const pills = systemDetailRoot.querySelectorAll('.system-detail__pill');
  const figures = systemDetailRoot.querySelectorAll('.system-detail__figure');
  const title = systemDetailRoot.querySelector('[data-detail-title]');
  const text = systemDetailRoot.querySelector('[data-detail-text]');

  function setSystemDetail(key) {
    const data = systemDetailData[key];
    if (!data) return;

    pills.forEach((pill) => {
      const isActive = pill.dataset.detail === key;
      pill.classList.toggle('is-active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    figures.forEach((figure) => {
      const isActive = figure.dataset.detailFigure === key;
      figure.classList.toggle('is-active', isActive);

      if (isActive) {
        figure.style.backgroundImage = `url("${data.image}")`;
        figure.classList.add('has-background-image');

        const caption = figure.querySelector('figcaption');
        if (caption) {
          caption.textContent = data.caption;
        }
      }
    });

    if (title) {
      title.textContent = data.title;
    }

    if (text) {
      text.textContent = data.text;
    }
  }

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setSystemDetail(pill.dataset.detail);
    });
  });

  setSystemDetail('sequence');
}
