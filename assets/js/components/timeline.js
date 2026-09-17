// Created by Ali Zaghloul on 16/09/2026
/** Experience timeline: line draws with scroll progress, items pop in. */
import { experience, education } from '../../../data/experience.js';
import { $, esc, rafThrottle, clamp, prefersReducedMotion } from '../core/env.js';
import { initReveal } from '../core/reveal.js';

export function initTimeline() {
  const wrap = $('#timeline');
  const line = $('#timelineLine');
  const edu = $('#education');
  if (!wrap) return;

  wrap.insertAdjacentHTML('beforeend', experience.map((x, i) => `
    <article class="tl-item" data-reveal="${i % 2 ? 'right' : 'left'}">
      <div class="tl-item__head">
        <span class="tl-item__period">${esc(x.period)} · ${esc(x.location)}</span>
        <h3>${esc(x.company)}<span>${esc(x.position)}</span></h3>
      </div>
      <div class="card tl-item__body">
        <p>${esc(x.summary)}</p>
        <ul>${x.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
        <div class="row">${x.stack.map((s) => `<span class="badge">${esc(s)}</span>`).join('')}</div>
      </div>
    </article>`).join(''));

  if (edu) edu.innerHTML = education.map((e, i) => `<div class="card" style="--i:${i}"><b>${esc(e.title)}</b><span>${esc(e.org)}</span><small>${esc(e.year)}</small></div>`).join('');

  initReveal(wrap); initReveal(edu?.parentElement);

  if (prefersReducedMotion) { line.style.setProperty('--p', 1); return; }
  const update = rafThrottle(() => {
    const r = wrap.getBoundingClientRect();
    const start = window.innerHeight * 0.75;
    const p = clamp((start - r.top) / r.height, 0, 1);
    line.style.setProperty('--p', p.toFixed(3));
  });
  window.addEventListener('scroll', update, { passive: true });
  update();
}
