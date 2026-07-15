export const FLOATING_GUIDE_STATES = {
  ROAMING: 'roaming', EXITING_TO_DESTINATION: 'exiting-to-destination', SCROLLING_TO_DESTINATION: 'scrolling-to-destination', ENTERING_DESTINATION: 'entering-destination', ANCHORED_AT_DESTINATION: 'anchored-at-destination', EXITING_TO_ORIGIN: 'exiting-to-origin', SCROLLING_TO_ORIGIN: 'scrolling-to-origin', ENTERING_ORIGIN: 'entering-origin'
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const sleepFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

export class FloatingTimeGuideController {
  constructor({ guide, destination, destinationAnchor, layer = guide?.closest('[data-floating-time-guide-layer]'), status, label, exclusionSelector = '[data-floating-guide-exclusion]', headerSelector = 'header, .experience-header', context = 'maquinaDoTempo' }) {
    this.guide = guide; this.destination = destination; this.destinationAnchor = destinationAnchor; this.layer = layer;
    this.status = status; this.label = label; this.exclusionSelector = exclusionSelector; this.headerSelector = headerSelector; this.context = context;
    this.state = FLOATING_GUIDE_STATES.ROAMING; this.originSnapshot = null; this.pose = { x: 32, y: 96, rotation: -3, scale: 1, opacity: 0.9 };
    this.safeBounds = { top: 72, right: 28, bottom: 36, left: 28 }; this.recentFlightPatterns = []; this.flightAnimation = null; this.anchorAnimation = null;
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)'); this.mobileQuery = matchMedia('(max-width: 767px)'); this.resizeTimer = 0; this.initialized = false;
  }

  init() {
    if (this.initialized) return; if (!this.guide || !this.destination || !this.destinationAnchor) { console.error(`[${this.context}] Elementos necessários para o guia flutuante não encontrados.`); return; }
    this.initialized = true; this.placeInSafeArea(); this.bindEvents(); this.updateA11y(false); this.startRoaming();
  }

  bindEvents() {
    this.guide.addEventListener('click', () => this.handleClick());
    this.guide.addEventListener('pointerenter', () => this.pauseFlight());
    this.guide.addEventListener('pointerleave', () => { if (this.state === FLOATING_GUIDE_STATES.ROAMING) this.startRoaming(); });
    this.guide.addEventListener('focusin', () => this.pauseFlight());
    this.guide.addEventListener('focusout', () => { if (this.state === FLOATING_GUIDE_STATES.ROAMING) this.startRoaming(); });
    const refresh = () => { clearTimeout(this.resizeTimer); this.resizeTimer = setTimeout(() => this.reflow(), 120); };
    addEventListener('resize', refresh, { passive: true }); addEventListener('orientationchange', refresh, { passive: true }); this.mobileQuery.addEventListener?.('change', refresh); this.reduceMotion.addEventListener?.('change', refresh);
    this.destination.querySelector('img')?.addEventListener('load', refresh, { passive: true });
    if ('ResizeObserver' in window) { this.resizeObserver = new ResizeObserver(refresh); this.resizeObserver.observe(this.destination); this.resizeObserver.observe(document.documentElement); }
  }

  reflow() { if (this.state === FLOATING_GUIDE_STATES.ANCHORED_AT_DESTINATION) this.positionAtAnchor(); else if (this.state === FLOATING_GUIDE_STATES.ROAMING) { this.pose.x = clamp(this.pose.x, this.safeBounds.left, innerWidth - this.box().width - this.safeBounds.right); this.pose.y = clamp(this.pose.y, this.safeBounds.top, innerHeight - this.box().height - this.safeBounds.bottom); this.applyPose(); this.startRoaming(); } }
  box() { return this.guide.getBoundingClientRect(); }
  applyPose(opacity = this.pose.opacity) { Object.assign(this.guide.style, { transform: `translate3d(${this.pose.x}px, ${this.pose.y}px, 0) rotate(${this.pose.rotation}deg) scale(${this.pose.scale})`, opacity }); }
  placeInSafeArea() { const b = this.box(); this.pose = { x: clamp(innerWidth * .72, this.safeBounds.left, innerWidth - b.width - this.safeBounds.right), y: clamp(innerHeight * .22, this.safeBounds.top, innerHeight - b.height - this.safeBounds.bottom), rotation: -3, scale: 1, opacity: this.mobileQuery.matches ? .72 : .9 }; this.applyPose(); }

  startRoaming() { this.pauseFlight(); if (this.reduceMotion.matches || this.state !== FLOATING_GUIDE_STATES.ROAMING) { this.applyPose(); return; } this.flySegment(); }
  pauseFlight() { this.flightAnimation?.cancel(); this.flightAnimation = null; }
  flySegment() {
    if (this.state !== FLOATING_GUIDE_STATES.ROAMING || this.reduceMotion.matches || document.activeElement === this.guide) return;
    const next = this.nextPose(); const from = { ...this.pose }; this.pose = next;
    this.flightAnimation = this.guide.animate([{ transform: `translate3d(${from.x}px, ${from.y}px, 0) rotate(${from.rotation}deg) scale(${from.scale})`, opacity: from.opacity }, { transform: `translate3d(${next.x}px, ${next.y}px, 0) rotate(${next.rotation}deg) scale(${next.scale})`, opacity: next.opacity }], { duration: next.duration, easing: next.easing, fill: 'forwards' });
    this.flightAnimation.finished.then(() => { this.applyPose(); this.flySegment(); }).catch(() => {});
  }
  nextPose() {
    const b = this.box(); const easings = ['cubic-bezier(.22,1,.36,1)', 'cubic-bezier(.37,0,.21,1)', 'ease-in-out'];
    for (let i = 0; i < 12; i++) {
      const dx = (12 + Math.random()*42) * (Math.random() > .5 ? 1 : -1); const dy = (8 + Math.random()*30) * (Math.random() > .5 ? 1 : -1);
      const x = clamp(this.pose.x + dx, this.safeBounds.left, innerWidth - b.width - this.safeBounds.right); const y = clamp(this.pose.y + dy, this.safeBounds.top, innerHeight - b.height - this.safeBounds.bottom);
      const candidate = { x, y, rotation: -4 + Math.random()*8, scale: .96 + Math.random()*.075, opacity: this.mobileQuery.matches ? .72 : .9, duration: 8000 + Math.random()*11000, easing: easings[Math.floor(Math.random()*easings.length)] };
      const sig = `${Math.sign(dx)}:${Math.sign(dy)}:${Math.round(candidate.duration/3000)}:${candidate.easing}:${x > innerWidth/2}-${y > innerHeight/2}`;
      if (!this.recentFlightPatterns.includes(sig) && !this.overlapsExclusion(candidate)) { this.recentFlightPatterns.push(sig); this.recentFlightPatterns = this.recentFlightPatterns.slice(-7); return candidate; }
    }
    return { ...this.pose, rotation: this.pose.rotation + 1, duration: 9000, easing: 'ease-in-out' };
  }
  overlapsExclusion(pose) { const b = this.box(); const r = { left: pose.x, top: pose.y, right: pose.x + b.width, bottom: pose.y + b.height }; return [...document.querySelectorAll(this.exclusionSelector)].some((el) => { const e = el.getBoundingClientRect(); const x = Math.max(0, Math.min(r.right, e.right) - Math.max(r.left, e.left)); const y = Math.max(0, Math.min(r.bottom, e.bottom) - Math.max(r.top, e.top)); return x*y > b.width*b.height*.18; }); }

  async handleClick() { if (this.guide.disabled) return; if (this.state === FLOATING_GUIDE_STATES.ROAMING) return this.travelToDestination(); if (this.state === FLOATING_GUIDE_STATES.ANCHORED_AT_DESTINATION) return this.returnToOrigin(); }
  snapshot() { const r = this.box(); return { scrollX, scrollY, viewportWidth: innerWidth, viewportHeight: innerHeight, documentHeight: document.documentElement.scrollHeight, guideRect: r, timestamp: Date.now() }; }
  async travelToDestination() { this.originSnapshot = this.snapshot(); this.log({ type: 'floating-guide-travel-to-time-machine', originScrollY: this.originSnapshot.scrollY, timestamp: Date.now() }); await this.transition(FLOATING_GUIDE_STATES.EXITING_TO_DESTINATION, FLOATING_GUIDE_STATES.SCROLLING_TO_DESTINATION, FLOATING_GUIDE_STATES.ENTERING_DESTINATION, () => this.getDestinationScrollTarget(this.destination), () => this.positionAtAnchor(), true); }
  async returnToOrigin() { const origin = this.originSnapshot; if (!origin) return this.resetSafe(); this.log({ type: 'floating-guide-return-from-time-machine', destinationScrollY: scrollY, timestamp: Date.now() }); await this.transition(FLOATING_GUIDE_STATES.EXITING_TO_ORIGIN, FLOATING_GUIDE_STATES.SCROLLING_TO_ORIGIN, FLOATING_GUIDE_STATES.ENTERING_ORIGIN, () => origin.scrollY, () => { scrollTo({ top: origin.scrollY, left: origin.scrollX, behavior: 'auto' }); this.pose = { x: clamp(origin.guideRect.left, this.safeBounds.left, innerWidth - this.box().width - this.safeBounds.right), y: clamp(origin.guideRect.top, this.safeBounds.top, innerHeight - this.box().height - this.safeBounds.bottom), rotation: -3, scale: 1, opacity: this.mobileQuery.matches ? .72 : .9 }; this.applyPose(0); }, false); this.originSnapshot = null; }
  async transition(exitState, scrollState, enterState, targetY, place, anchored) { try { this.guide.disabled = true; this.pauseFlight(); this.state = exitState; await this.portal('out'); this.state = scrollState; const y = Math.max(0, targetY()); scrollTo({ top: y, behavior: this.reduceMotion.matches ? 'auto' : 'smooth' }); await this.waitForScrollEnd({ targetY: y }); this.state = enterState; place(); await sleepFrame(); await this.portal('in'); this.state = anchored ? FLOATING_GUIDE_STATES.ANCHORED_AT_DESTINATION : FLOATING_GUIDE_STATES.ROAMING; this.updateA11y(anchored); this.guide.disabled = false; anchored ? this.startAnchoredIdle() : this.startRoaming(); } catch (e) { console.error(`[${this.context}] Falha na animação do guia flutuante.`, e); this.resetSafe(); } }
  portal(direction) { const out = direction === 'out'; const duration = this.reduceMotion.matches ? 140 : (out ? 640 : 700); const base = `translate3d(${this.pose.x}px, ${this.pose.y}px, 0)`; const frames = out ? [{ opacity: this.pose.opacity, transform: `${base} rotate(${this.pose.rotation}deg) scale(${this.pose.scale})` }, { opacity: .86, transform: `${base} translate(9px,-7px) rotate(${this.pose.rotation+90}deg) scale(.88)`, offset:.45 }, { opacity: .45, transform: `${base} translate(-7px,-3px) rotate(${this.pose.rotation+220}deg) scale(.52)`, offset:.72 }, { opacity: 0, transform: `${base} rotate(${this.pose.rotation+360}deg) scale(.04)` }] : [{ opacity:0, transform:`${base} rotate(${this.pose.rotation+360}deg) scale(.04)`}, {opacity:.45, transform:`${base} translate(-7px,-3px) rotate(${this.pose.rotation+220}deg) scale(.52)`, offset:.28}, {opacity:.86, transform:`${base} translate(9px,-7px) rotate(${this.pose.rotation+90}deg) scale(.88)`, offset:.58}, {opacity:this.pose.opacity, transform:`${base} rotate(${this.pose.rotation}deg) scale(${this.pose.scale})`}]; return this.guide.animate(frames, { duration, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }).finished; }
  getDestinationScrollTarget(el) { const header = document.querySelector(this.headerSelector); const hh = header?.getBoundingClientRect().height || 0; return Math.max(0, el.getBoundingClientRect().top + scrollY - hh - 24); }
  waitForScrollEnd({ targetY, tolerance = 2, stableFrames = 6, timeout = 3000 }) { return new Promise((resolve) => { let stable = 0; const start = performance.now(); const done = () => Math.abs(scrollY - targetY) <= tolerance; const check = () => { stable = done() ? stable + 1 : 0; if (stable >= stableFrames || performance.now() - start > timeout) resolve(); else requestAnimationFrame(check); }; if ('onscrollend' in window) addEventListener('scrollend', () => resolve(), { once:true }); check(); }); }
  positionAtAnchor() { if (!document.body.contains(this.destinationAnchor)) throw new Error('Destino removido do DOM.'); const a = this.destinationAnchor.getBoundingClientRect(); const b = this.box(); this.pose = { x: clamp(a.left - b.width/2, this.safeBounds.left, innerWidth - b.width - this.safeBounds.right), y: clamp(a.top - b.height/2, this.safeBounds.top, innerHeight - b.height - this.safeBounds.bottom), rotation: -4, scale: .92, opacity: .92 }; this.applyPose(); }
  startAnchoredIdle() { this.anchorAnimation?.cancel(); if (this.reduceMotion.matches) return; this.anchorAnimation = this.guide.animate([{ transform: this.guide.style.transform }, { transform: `translate3d(${this.pose.x}px, ${this.pose.y - 3}px, 0) rotate(-2deg) scale(.93)` }, { transform: this.guide.style.transform }], { duration: 3600, iterations: Infinity, easing: 'ease-in-out' }); }
  updateA11y(anchored) { const text = anchored ? 'Voltar ao ponto anterior da página' : 'Ir para a máquina do tempo'; this.guide.setAttribute('aria-pressed', String(anchored)); this.guide.setAttribute('aria-label', text); if (this.label) this.label.textContent = text; if (this.status) this.status.textContent = anchored ? 'Máquina do tempo alcançada.' : 'Retorno ao ponto anterior concluído.'; }
  log(payload) { window.dispatchEvent(new CustomEvent('time-machine:event', { detail: payload })); console.info('[floating-time-guide]', payload); }
  resetSafe() { this.guide.disabled = false; this.anchorAnimation?.cancel(); this.pose.opacity = this.mobileQuery.matches ? .72 : .9; this.applyPose(); this.state = FLOATING_GUIDE_STATES.ROAMING; this.updateA11y(false); this.startRoaming(); }
}
