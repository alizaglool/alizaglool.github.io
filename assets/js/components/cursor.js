// Created by Ali Zaghloul on 16/09/2026
/**
 * Custom cursor — fine pointers only. Dot follows instantly, ring eases.
 * Hover states: [data-cursor="view"] (project scenes), links/buttons → "link".
 */
import { $, isFinePointer, prefersReducedMotion, lerp } from '../core/env.js';

export function initCursor() {
  const el = $('#cursor');
  if (!el || !isFinePointer || prefersReducedMotion) return;
  document.documentElement.classList.add('has-cursor');

  const dot = el.querySelector('.cursor__dot');
  const ring = el.querySelector('.cursor__ring');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  let visible = false;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!visible) { visible = true; el.classList.remove('cursor--hidden'); }
  }, { passive: true });
  document.addEventListener('mouseleave', () => el.classList.add('cursor--hidden'));
  document.addEventListener('mouseenter', () => el.classList.remove('cursor--hidden'));

  const loop = () => {
    rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const interactive = 'a, button, [role="button"], input, textarea, label, .skill';
  document.addEventListener('mouseover', (e) => {
    const view = e.target.closest('[data-cursor="view"]');
    if (view) { el.classList.add('cursor--view'); el.classList.remove('cursor--link'); ring.querySelector('span').textContent = view.dataset.cursorLabel || 'VIEW'; return; }
    if (e.target.closest(interactive)) { el.classList.add('cursor--link'); el.classList.remove('cursor--view'); return; }
    el.classList.remove('cursor--link', 'cursor--view');
  });
  document.addEventListener('mousedown', () => dot.style.scale = '0.6');
  document.addEventListener('mouseup', () => dot.style.scale = '1');
}
