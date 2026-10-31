/** Glyph Portal © 2026 Christian Katzmann. MIT.
 * Origin: UsefulPortal.astro on https://ktzm.dk → UsefulPortal.tsx → ClarityPortal.tsx.
 * Shared React/offline adaptation. Keep this notice with copies.
 */
const gpClamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const gpSmooth = (a, b, n) => { const t = gpClamp((n - a) / (b - a)); return t * t * (3 - 2 * t); };
function gpInterior(context, char, font) {
  const canvas = context.canvas;
  context.font = font;
  const m = context.measureText(char), pad = 8;
  const left = Math.ceil(m.actualBoundingBoxLeft), ascent = Math.ceil(m.actualBoundingBoxAscent);
  canvas.width = Math.max(1, Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight) + pad * 2);
  canvas.height = Math.max(1, Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + pad * 2);
  context.font = font; context.fontKerning = 'none';
  context.fillText(char, pad + left, pad + ascent);
  const { width, height } = canvas, pixels = context.getImageData(0, 0, width, height).data;
  const rows = new Uint16Array(width + 1);
  let size = 0, bx = 0, by = 0;
  for (let y = 0; y < height; y++) {
    let diagonal = 0;
    for (let x = 0; x < width; x++) {
      const above = rows[x + 1];
      rows[x + 1] = pixels[(y * width + x) * 4 + 3] > 245 ? Math.min(above, rows[x], diagonal) + 1 : 0;
      diagonal = above;
      if (rows[x + 1] > size) { size = rows[x + 1]; bx = x; by = y; }
    }
  }
  return size < 3 ? null : { x: (bx + 1 - size / 2 - pad - left) / 3, y: (by + 1 - size / 2 - pad - ascent) / 3, radius: (size / 2 - 1) / 3 };
}
function gpScrollParent(element) {
  for (let p = element.parentElement; p; p = p.parentElement) {
    if (/(auto|scroll|hidden)/.test(getComputedStyle(p).overflowY) && p !== document.body && p !== document.documentElement) return p;
  }
  return null;
}
export function mountGlyphPortal(section, options = {}) {
  if (!section) return () => {};
  const text = options.word || section.dataset.gpWord || 'SUBLIME';
  const typographyOnly = options.typographyOnly ?? section.dataset.gpTypography === 'true';
  const interactive = options.interactive !== false && !typographyOnly;
  const length = gpClamp(Number(options.scrollLength ?? 2.4), 1, 8);
  const pin = section.querySelector('[data-gp-pin]'), field = section.querySelector('[data-gp-field]');
  const art = section.querySelector('[data-gp-art]'), glyph = section.querySelector('[data-gp-glyph]');
  const clip = section.querySelector('clipPath'), marks = section.querySelector('[data-gp-marks]');
  const choices = section.querySelector('[data-gp-choices]'), picker = section.querySelector('[data-gp-select]');
  const buttons = Array.from(choices?.querySelectorAll('button') ?? []);
  const root = gpScrollParent(section), motion = matchMedia('(prefers-reduced-motion: reduce)');
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!context || !pin || !glyph || !art) return () => {};
  let W = 1, H = 1, travel = 1, startScale = 1, endScale = 1, target = null;
  let center = { x: 0, y: 0 }, bounds, candidates = [], letters = [];
  let raf = 0, live = true, active = true, dirty = true, ready = false, last = -1;
  const position = () => gpClamp(((root ? root.getBoundingClientRect().top + root.clientTop : 0) - section.getBoundingClientRect().top) / travel);
  const select = next => {
    target = next;
    endScale = target ? Math.max(startScale, Math.hypot(W, H) / (target.radius * 1.35)) : startScale;
    section.dataset.gpFocus = target ? Array.from(text.slice(target.index))[0] : '';
    section.dataset.gpFocusIndex = String(target?.index ?? -1);
    buttons.forEach(button => {
      const i = Number(button.dataset.gpLetter), selected = i === target?.index;
      button.disabled = !candidates.some(c => c.index === i);
      button.setAttribute('aria-checked', String(selected)); button.tabIndex = selected ? 0 : -1;
    });
    if (picker) {
      if (picker.value !== '') picker.value = String(target?.index ?? -1);
      Array.from(picker.options).forEach(o => { o.disabled = o.value === '' || !candidates.some(c => c.index === Number(o.value)); });
    }
    if (marks && bounds) {
      const u = 1 / startScale, y = bounds.y + bounds.height + 25 * u;
      const cross = target ? `M${target.x - 9 * u} ${target.y}h${18 * u}M${target.x} ${target.y - 9 * u}v${18 * u}` : '';
      const path = marks.querySelector('path');
      path.setAttribute('d', `M${bounds.x} ${y}H${bounds.x + bounds.width}${cross}`); path.setAttribute('stroke-width', String(u));
    }
  };
  const layout = () => {
    W = Math.max(1, pin.clientWidth);
    const probe = section.querySelector('[data-gp-viewport]');
    const vh = probe?.offsetHeight || window.innerHeight;
    H = motion.matches && !typographyOnly ? Math.min(vh * .75, 480) : Math.min(root?.clientHeight ?? vh, vh);
    H = Math.max(1, H); travel = H * length;
    section.style.setProperty('--gp-height', `${H}px`);
    art.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const font = getComputedStyle(glyph), family = font.fontFamily, weight = font.fontWeight;
    context.font = `${weight} 100px ${family}`; context.fontKerning = 'none';
    const m = context.measureText(text);
    bounds = { x: -m.actualBoundingBoxLeft, y: -m.actualBoundingBoxAscent, width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight, height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent };
    if (!bounds.width || !bounds.height) return;
    center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
    const advances = Array.from({ length: text.length }, (_, i) => context.measureText(text.slice(0, i)).width);
    candidates = []; letters = []; let offset = 0;
    for (const char of Array.from(text)) {
      context.font = `${weight} 100px ${family}`;
      const cm = context.measureText(char);
      letters.push({ index: offset, x: advances[offset] - cm.actualBoundingBoxLeft, y: -cm.actualBoundingBoxAscent, width: cm.actualBoundingBoxLeft + cm.actualBoundingBoxRight, height: cm.actualBoundingBoxAscent + cm.actualBoundingBoxDescent });
      if (!typographyOnly) {
        const found = gpInterior(context, char, `${weight} 300px ${family}`);
        if (found) candidates.push({ ...found, x: found.x + advances[offset], index: offset });
      }
      offset += char.length;
    }
    startScale = Math.min(W * .84 / bounds.width, H * .38 / bounds.height);
    const previous = target?.index, requested = options.focusChar ? text.indexOf(options.focusChar.normalize('NFC')) : -1;
    select(candidates.find(c => c.index === previous) ?? candidates.find(c => c.index === requested) ?? [...candidates].sort((a, b) => b.radius - a.radius || Math.abs(a.x - center.x) - Math.abs(b.x - center.x))[0] ?? null);
    buttons.forEach(button => {
      const l = letters.find(letter => letter.index === Number(button.dataset.gpLetter));
      if (l) Object.assign(button.style, { left: `${W / 2 + (l.x - center.x) * startScale}px`, top: `${H * .46 + (l.y - center.y) * startScale - Math.max(0, 44 - l.height * startScale) / 2}px`, width: `${Math.max(1, l.width * startScale)}px`, height: `${Math.max(44, l.height * startScale)}px` });
    });
    section.style.setProperty('--gp-word-top', `${H * .46 - bounds.height * startScale / 2}px`);
    section.style.setProperty('--gp-word-bottom', `${H * .46 + bounds.height * startScale / 2}px`);
    section.dataset.gpReady = 'true';
    section.dataset.gpMotion = !typographyOnly && !motion.matches && target ? 'on' : 'off';
    ready = true;
  };
  const paint = () => {
    const p = typographyOnly || motion.matches || !target ? 0 : position();
    const t = gpClamp(p / .78), eased = t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
    const scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
    const blend = endScale === startScale ? 0 : (1 / scale - 1 / startScale) / (1 / endScale - 1 / startScale);
    const cx = center.x + ((target?.x ?? center.x) - center.x) * blend, cy = center.y + ((target?.y ?? center.y) - center.y) * blend;
    const roll = -4 * gpSmooth(.06,.5,t) * (1 - gpSmooth(.62,.92,t));
    if (typographyOnly) {
      glyph.setAttribute('transform', `translate(${W / 2} ${H * .46}) scale(${startScale}) translate(${-center.x} ${-center.y})`);
    } else if (clip) {
      const radians = roll * Math.PI / 180, dx = W / 2 / scale, dy = (H * .46 + H * .04 * eased) / scale;
      clip.setAttribute('transform', `scale(${scale}) rotate(${roll})`);
      glyph.setAttribute('transform', `translate(${Math.cos(radians) * dx + Math.sin(radians) * dy - cx} ${-Math.sin(radians) * dx + Math.cos(radians) * dy - cy})`);
      if (field) field.style.clipPath = t >= 1 ? 'none' : `url(#${clip.id})`;
    }
    if (marks) { marks.setAttribute('transform', `translate(${W / 2} ${H * .46 + H * .04 * eased}) scale(${scale}) rotate(${roll}) translate(${-cx} ${-cy})`); marks.style.opacity = String(1 - gpSmooth(.015,.17,p)); }
    const choosing = interactive && !motion.matches && p < .04 && Boolean(target);
    if (choices) choices.inert = !choosing;
    section.dataset.gpChoosing = String(choosing);
    section.dataset.gpEntered = String(p >= .9); section.dataset.gpProgress = p.toFixed(5);
    section.style.setProperty('--gp-caption', String(1 - gpSmooth(.01,.16,p)));
    section.style.setProperty('--gp-reveal', String(motion.matches ? 1 : gpSmooth(.78,.9,p)));
    section.style.setProperty('--gp-field-scale', String(1 + .16 * gpSmooth(0,.82,p)));
    if (p !== last) { last = p; options.onProgress?.(p); }
  };
  const frame = () => { raf = 0; if (!live) return; if (dirty) { dirty = false; layout(); } if (ready) paint(); };
  const schedule = () => { if (!raf && active) raf = requestAnimationFrame(frame); };
  const resize = () => { dirty = true; schedule(); };
  const choose = event => {
    if (section.dataset.gpChoosing !== 'true') return;
    const button = event.target.closest('[data-gp-letter]');
    const next = candidates.find(c => c.index === Number(button?.dataset.gpLetter));
    if (next) { select(next); paint(); }
  };
  const navigate = event => {
    if (section.dataset.gpChoosing !== 'true' || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    event.preventDefault(); const at = candidates.indexOf(target);
    const i = event.key === 'Home' ? 0 : event.key === 'End' ? candidates.length - 1 : (at + (['ArrowLeft','ArrowUp'].includes(event.key) ? -1 : 1) + candidates.length) % candidates.length;
    buttons.find(b => Number(b.dataset.gpLetter) === candidates[i]?.index)?.focus({ preventScroll: true });
  };
  const pick = () => { const next = candidates.find(c => c.index === Number(picker?.value)); if (next && section.dataset.gpChoosing === 'true') { select(next); paint(); } };
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
  observer?.observe(section); if (root) observer?.observe(root);
  const visibility = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) schedule(); }, { root, rootMargin: '100% 0px' });
  visibility?.observe(section);
  if (!typographyOnly) (root ?? window).addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize); window.visualViewport?.addEventListener('resize', resize); motion.addEventListener('change', resize);
  ['pointerover','click','focusin'].forEach(name => choices?.addEventListener(name, choose)); choices?.addEventListener('keydown', navigate); picker?.addEventListener('change', pick);
  document.fonts?.ready.then(() => { if (live) resize(); });
  frame();
  return () => {
    live = false; cancelAnimationFrame(raf); observer?.disconnect(); visibility?.disconnect();
    (root ?? window).removeEventListener('scroll', schedule); window.removeEventListener('resize', resize); window.visualViewport?.removeEventListener('resize', resize); motion.removeEventListener('change', resize);
    ['pointerover','click','focusin'].forEach(name => choices?.removeEventListener(name, choose)); choices?.removeEventListener('keydown', navigate); picker?.removeEventListener('change', pick);
  };
}
