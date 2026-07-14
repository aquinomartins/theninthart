import { comicsManifest } from './comics-manifest.js';

const sectionMap = {
  hero: { layout: 'hero-three', assets: [['imagem-hq-1','hero'],['hq-008','left'],['hq-009','center'],['hq-010','right']] },
  vestige: { layout: 'asymmetric-story', assets: ['hq-008','hq-009','hq-010','imagem-hq-1','scene-object-013'] },
  characters: { layout: 'hero-three', assets: ['hq-009','hq-010','hq-008','scene-object-018'] },
  machine: { layout: 'rail-stack', assets: [['hq-002','rail'],['hq-001','top'],['hq-003','midA'],['hq-004','midB'],['hq-005','footer']] },
  mechanism: { layout: 'diagonal-strips', assets: ['hq-006','hq-007','hq-003','hq-005'] },
  objects: { layout: 'editorial-mosaic', assets: ['scene-object-013','scene-object-018','scene-020','scene-021','hq-005','hq-006'] },
  motion: { layout: 'asymmetric-story', assets: ['hq-006','hq-007','page-dino','page-travel-1','page-travel-2'] },
  kitchen: { layout: 'hero-three', assets: [['imagem-hq-1','hero'],['hq-008','left'],['hq-009','center'],['hq-010','right']] },
  rules: { layout: 'diagonal-strips', assets: ['page-travel-1','hq-006','hq-007','page-dino'] },
  band: { layout: 'rail-stack', assets: ['scene-020','page-public-1','scene-object-013','scene-object-018','page-public-2'] },
  public: { layout: 'asymmetric-story', assets: ['page-public-1','page-public-2','scene-object-013','scene-021','page-public-3'] },
  finale: { layout: 'hero-three', assets: [['page-public-3','hero'],['page-14-5','left'],['scene-020','center'],['scene-021','right']] },
  footer: { layout: 'editorial-mosaic', assets: ['hq-008','hq-001','hq-006','page-public-3'] }
};

const assets = Object.fromEntries(comicsManifest.assets.map((asset) => [asset.id, asset]));
const roleByIndex = ['hero','left','center','right','bubble','sideA','lowerA','lowerB','rail','top','midA','midB','lowB','footer'];

export function createComicPanel(asset, options = {}) {
  const figure = document.createElement('figure');
  figure.className = `comic-panel comic-panel--${asset.type}`;
  figure.dataset.assetId = asset.id;
  figure.dataset.fit = options.fit || asset.fit;
  figure.dataset.role = options.role || asset.layoutRole || roleByIndex[options.index] || 'panel';
  if (asset.reactsTo?.length) figure.dataset.reactsTo = asset.reactsTo.join(' ');
  figure.style.setProperty('--focal-x', `${asset.focalPoint.x}%`);
  figure.style.setProperty('--focal-y', `${asset.focalPoint.y}%`);
  const img = document.createElement('img');
  img.src = asset.src;
  img.width = asset.width;
  img.height = asset.height;
  img.alt = asset.alt;
  img.decoding = 'async';
  img.loading = options.eager ? 'eager' : 'lazy';
  if (options.eager) img.fetchPriority = 'high';
  figure.append(img);
  return figure;
}

export function createComicLayout(layoutDefinition) {
  const page = document.createElement('div');
  page.className = `comic-page comic-layout comic-layout--${layoutDefinition.layout}`;
  layoutDefinition.assets.map((entry) => Array.isArray(entry) ? { asset: assets[entry[0]], role: entry[1] } : { asset: assets[entry], role: null }).filter(({ asset }) => asset?.enabled && asset.type !== 'layout-reference').forEach(({ asset, role }, index) => {
    page.append(createComicPanel(asset, { index, role: role || asset.layoutRole || roleByIndex[index], eager: layoutDefinition.eager && index === 0 }));
  });
  return page;
}

export function renderSectionComicBackground(sectionId, chapter) {
  const section = document.getElementById(sectionId) || document.querySelector(`[data-comic-section="${sectionId}"]`);
  const definition = sectionMap[chapter || sectionId];
  if (!section || !definition || section.querySelector(':scope > .comic-section__art')) return;
  section.classList.add('comic-section');
  const art = document.createElement('div');
  art.className = 'comic-section__art';
  art.setAttribute('aria-hidden', 'true');
  art.append(createComicLayout({ ...definition, eager: sectionId === 'hero' }));
  const content = document.createElement('div');
  content.className = 'comic-section__content';
  while (section.firstChild) content.append(section.firstChild);
  section.append(art, content);
}

export function initComicLanding() {
  const unnamed = [
    ['characters', document.querySelectorAll('main > section')[2]], ['mechanism', document.querySelectorAll('main > section')[4]],
    ['motion', document.querySelector('.motion-strip')], ['rules', document.querySelectorAll('main > section')[8]],
    ['band', document.querySelectorAll('main > section')[9]], ['finale', document.querySelector('.finale')]
  ];
  unnamed.forEach(([key, node]) => { if (node) node.dataset.comicSection = key; });
  ['hero','vestige','machine','objects','kitchen','public'].forEach((id) => renderSectionComicBackground(id));
  unnamed.forEach(([key]) => renderSectionComicBackground(key));
  document.querySelector('footer')?.classList.add('comic-section','comic-footer');
}

export function updateReactiveComicPanels(state = {}) {
  document.querySelectorAll('[data-reacts-to]').forEach((panel) => {
    const reacts = panel.dataset.reactsTo;
    panel.classList.toggle('is-reacting', Boolean((state.selectedPart && reacts.includes('selected-part')) || (state.selectedObject && reacts.includes('selected-object')) || (state.temporalState && reacts.includes('temporal-state')) || (state.publicState && reacts.includes('public-state'))));
  });
}

export function applyResponsiveLayout() { document.documentElement.dataset.comicViewport = innerWidth < 768 ? 'mobile' : innerWidth < 1100 ? 'tablet' : 'desktop'; }
