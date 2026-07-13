import { assets } from './modules/asset-manifest.js';
import { createDetailCarousel } from './modules/carousel.js';
import { renderKitchen } from './modules/kitchen-renderer.js';
import { initScrollScenes } from './modules/scroll-scenes.js';
import { initAdminPanel } from './modules/admin-panel.js';
import { createSession, updateSession, localPersistence } from './modules/state-store.js';
import { createPublicSnapshot } from './modules/public-state.js';
import { createSeed, getDominantEra } from './modules/temporal-engine.js';

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Não foi possível carregar ${path}`);
  return response.json();
}

async function boot() {
  hydrateAssetImages();
  initScrollScenes();
  const dataset = { eras: await loadJson('data/eras.json'), parts: await loadJson('data/machine-parts.json'), objects: await loadJson('data/kitchen-objects.json'), panels: await loadJson('data/story-panels.json') };
  let publicSnapshot = await localPersistence.loadPublicSnapshot() || createPublicSnapshot(await localPersistence.loadSessions(), dataset.eras);
  let session = restoreFromUrl(dataset) || await localPersistence.loadCurrentSession() || createSession(dataset);
  session = updateSession(session, dataset, {});

  async function persistAndRender() { await localPersistence.saveSession(session); updateUrl(session); renderAll(); }
  function renderAll() {
    const dominant = getDominantEra(session.vector, dataset.eras);
    document.documentElement.style.setProperty('--temporal-accent', dataset.parts.find((part) => session.selectedParts.includes(part.id))?.accent || dominant.theme.accent || '#0a84ff');
    qs('[data-hero-subtitle]').textContent = heroLine(dominant, session);
    qs('[data-dominant-label]').textContent = `Estado dominante: ${dominant.label} · ${Math.round((session.vector[dominant.id] || 0) * 100)}%`;
    qs('[data-machine-summary]').textContent = dataset.parts.filter((part) => session.selectedParts.includes(part.id)).map((part) => part.summary).at(-1) || 'A máquina aguarda uma peça.';
    qs('[data-mechanism-copy]').textContent = `A montagem atual puxa a cozinha para ${dominant.label.toLowerCase()} sem apagar rastros das outras eras.`;
    qs('[data-vector-readout]').textContent = JSON.stringify(session.vector, null, 2);
    qs('[data-state-summary]').textContent = `Sua linha: ${session.selectedParts.length} peça(s), ${session.selectedObjects.length} objeto(s), dominante ${dominant.label}.`;
    qs('[data-public-pulse]').textContent = `Cozinha pública: ${Math.round(Math.max(...Object.values(publicSnapshot.vector)) * 100)}% em ${getDominantEra(publicSnapshot.vector, dataset.eras).label}.`;
    renderBars(qs('[data-bars="individual"]'), session.vector, dataset.eras);
    renderBars(qs('[data-bars="public"]'), publicSnapshot.vector, dataset.eras);
    renderObjectList(dataset, session);
    renderKitchen(qs('[data-kitchen-scene]'), qs('[data-kitchen-status]'), dataset, session, publicSnapshot, dominant, createSeed(publicSnapshot));
    qsa('[data-toggle-tech]').forEach((button) => button.addEventListener('click', () => { const note = qs('[data-tech-note]'); const open = note.hasAttribute('hidden'); note.toggleAttribute('hidden', !open); button.setAttribute('aria-expanded', String(open)); }, { once: true }));
  }

  createDetailCarousel(qs('[data-machine-carousel]'), dataset.parts, (part, user) => {
    qs('[data-part-image]').src = assets[part.imageKey] || assets.mechanism;
    if (user && !session.selectedParts.includes(part.id)) {
      session = updateSession(session, dataset, { selectedParts: [...session.selectedParts, part.id].slice(-5) });
      persistAndRender();
    } else {
      renderAll();
    }
  });

  renderObjectList(dataset, session);
  bindEvents(dataset, () => session, (next) => { session = next; }, async () => { publicSnapshot = await refreshPublic(dataset); renderAll(); });
  initAdminPanel({ dialog: qs('[data-admin-dialog]'), dataset, persistence: localPersistence, onRestore: () => location.reload() });
  qs('[data-open-admin]')?.addEventListener('click', () => qs('[data-admin-dialog]').showModal());

  await persistAndRender();
}

function hydrateAssetImages() {
  qsa('[data-asset-key]').forEach((image) => {
    const source = assets[image.dataset.assetKey];
    if (source && image.getAttribute('src') !== source) image.src = source;
  });
}

function renderObjectList(dataset, session) {
  const root = qs('[data-object-list]');
  if (!root) return;
  const dominant = getDominantEra(session.vector, dataset.eras);
  root.innerHTML = dataset.objects.map((object) => {
    const version = object.versions.find((item) => item.eraId === dominant.id) || object.versions[0];
    const selected = session.selectedObjects.includes(object.id);
    return `<article class="object-card ${selected ? 'is-selected' : ''}"><div class="object-thumb" data-slot="kitchen-object" data-object-id="${object.id}" data-era-id="${version.eraId}">${object.name.slice(0, 2)}</div><h3>${object.name}</h3><p>${object.function}</p><p><strong>${version.label}</strong></p><button type="button" data-toggle-object="${object.id}" aria-pressed="${selected}">${selected ? 'Remover' : 'Selecionar'}</button></article>`;
  }).join('');
}

function bindEvents(dataset, getSession, setSession, refresh) {
  document.addEventListener('click', async (event) => {
    const toggle = event.target.closest('[data-toggle-object]');
    if (toggle) {
      const session = getSession(); const id = toggle.dataset.toggleObject;
      const selectedObjects = session.selectedObjects.includes(id) ? session.selectedObjects.filter((item) => item !== id) : [...session.selectedObjects, id];
      setSession(updateSession(session, dataset, { selectedObjects }));
      await localPersistence.saveSession(getSession()); updateUrl(getSession()); refresh();
    }
    if (event.target.closest('[data-complete-session]')) {
      setSession({ ...getSession(), completed: true, updatedAt: new Date().toISOString() });
      await localPersistence.saveSession(getSession()); await refresh();
    }
    if (event.target.closest('[data-reset-session]')) {
      setSession(createSession(dataset)); await localPersistence.saveSession(getSession()); updateUrl(getSession()); document.getElementById('machine')?.scrollIntoView({ behavior: 'smooth' }); await refresh();
    }
  });
}

async function refreshPublic(dataset) {
  const snapshot = createPublicSnapshot(await localPersistence.loadSessions(), dataset.eras);
  await localPersistence.savePublicSnapshot(snapshot);
  return snapshot;
}

function renderBars(root, vector, eras) {
  if (!root) return;
  root.innerHTML = eras.map((era) => `<div data-era="${era.id}"><span>${era.label}</span><i style="transform:scaleX(${vector[era.id] || 0})"></i><b>${Math.round((vector[era.id] || 0) * 100)}%</b></div>`).join('');
}

function heroLine(era, session) {
  const object = session.selectedObjects.at(-1) || 'forma';
  return era.id === 'past' ? `O ${object} lembra o bolo antes da chegada.` : era.id === 'future' ? `O ${object} chegou de uma fornada que ainda não aconteceu.` : `O ${object} mantém o presente aberto por alguns quadros.`;
}

function updateUrl(session) {
  const params = new URLSearchParams(location.search);
  params.set('parts', session.selectedParts.join(',')); params.set('objects', session.selectedObjects.join(','));
  history.replaceState(null, '', `${location.pathname}?${params.toString()}${location.hash}`);
}

function restoreFromUrl(dataset) {
  const params = new URLSearchParams(location.search);
  if (!params.has('parts') && !params.has('objects')) return null;
  const parts = (params.get('parts') || '').split(',').filter((id) => dataset.parts.some((part) => part.id === id));
  const objects = (params.get('objects') || '').split(',').filter((id) => dataset.objects.some((object) => object.id === id));
  return createSession(dataset, { parts: parts.length ? parts : ['sequence'], objects: objects.length ? objects : ['forma'] });
}

boot().catch((error) => { console.error(error); document.body.insertAdjacentHTML('afterbegin', '<p role="alert" style="padding:1rem;background:#401;color:white">A experiência carregou em modo básico porque um recurso falhou.</p>'); });
