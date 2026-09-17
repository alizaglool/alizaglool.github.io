// Created by Ali Zaghloul on 16/09/2026
/** Verified stats with count-up on first view. */
import { stats } from '../../../data/site.js';
import { $, $$, esc, prefersReducedMotion } from '../core/env.js';
import { onceVisible } from '../core/reveal.js';

function countUp(el, target, decimals, duration = 1400) {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initStats() {
  const grid = $('#statsGrid');
  if (!grid) return;
  grid.innerHTML = stats.map((s, i) => `
    <div class="card stat" style="--i:${i}">
      <b><span data-count="${s.value}" data-decimals="${s.decimals || 0}">0</span><em>${esc(s.suffix)}</em></b>
      <span>${esc(s.label)}</span><small>${esc(s.note)}</small>
    </div>`).join('');
  onceVisible(grid, () => {
    $$('[data-count]', grid).forEach((el) => {
      const v = parseFloat(el.dataset.count), d = parseInt(el.dataset.decimals, 10);
      if (prefersReducedMotion) el.textContent = v.toFixed(d); else countUp(el, v, d);
    });
  });
}
