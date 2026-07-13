import { getClosestVersion } from './temporal-engine.js';

const layers = ['background','architecture','surfaces','ambient-light','characters','objects-behind','objects-main','objects-front','speech-bubbles','temporal-effects','ui-hotspots'];

export function ensureKitchenLayers(scene) {
  layers.forEach((layer) => {
    if (!scene.querySelector(`[data-layer="${layer}"]`)) {
      const node = document.createElement('div'); node.dataset.layer = layer; node.className = `kitchen-layer kitchen-layer--${layer}`; scene.append(node);
    }
  });
}

export function renderKitchen(scene, status, dataset, session, publicSnapshot, dominantEra, seed = 0) {
  ensureKitchenLayers(scene);
  scene.dataset.era = dominantEra.id;
  const selected = session.selectedObjects.map((id) => dataset.objects.find((object) => object.id === id)).filter(Boolean);
  layers.filter((layer) => layer.startsWith('objects')).forEach((layer) => { scene.querySelector(`[data-layer="${layer}"]`).innerHTML = ''; });
  selected.forEach((object, index) => {
    const version = getClosestVersion(object, dominantEra.id, dataset.eras);
    const layer = scene.querySelector(`[data-layer="${version.layer || 'objects-main'}"]`);
    layer?.insertAdjacentHTML('beforeend', objectMarkup(object, version, index, seed));
  });
  const bubbles = scene.querySelector('[data-layer="speech-bubbles"]');
  bubbles.innerHTML = '<p class="speech speech--hagia">Hagia: a sarjeta virou motor.</p><p class="speech speech--pio">Pio: eu já testei antes de começar.</p>';
  const effects = scene.querySelector('[data-layer="temporal-effects"]');
  effects.innerHTML = '<span class="temporal-ring"></span><span class="temporal-grain"></span>';
  if (status) status.innerHTML = `<p class="kicker">Cozinha pública</p><h3>${dominantEra.label} dominante</h3><p>Minha escolha mudou a cozinha: ${selected.map((item) => item.name).join(', ') || 'nenhum objeto'} coexistem neste quadro.</p><button class="ghost-button" type="button" data-toggle-tech aria-expanded="false">Como isso funciona?</button><div class="technical-note" hidden data-tech-note>O sistema recalculou Vᵢ, combinou com o snapshot público local e escolheu a versão mais próxima de cada objeto pela ordem das eras.</div>`;
  scene.setAttribute('aria-label', `Cozinha temporal em ${dominantEra.label}, com ${selected.length} objetos selecionados.`);
}

function objectMarkup(object, version, index, seed) {
  const dx = ((seed + index * 17) % 7) - 3;
  const dy = ((seed + index * 11) % 5) - 2;
  const hue = version.eraId === 'past' ? 32 : version.eraId === 'future' ? 265 : 205;
  return `<button class="kitchen-object" style="--x:${version.position.x + dx}%;--y:${version.position.y + dy}%;--object-hue:${hue};--scale:${version.scale || 1}" data-slot="kitchen-object" data-object-id="${object.id}" data-era-id="${version.eraId}" aria-label="${version.label}: ${version.description}"><svg viewBox="0 0 120 86" role="img" aria-hidden="true"><rect x="10" y="22" width="100" height="44" rx="18" fill="currentColor" opacity=".16"/><path d="M22 58 C38 20 76 16 98 53" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><circle cx="60" cy="48" r="13" fill="currentColor" opacity=".74"/></svg><span>${object.name}</span></button>`;
}
