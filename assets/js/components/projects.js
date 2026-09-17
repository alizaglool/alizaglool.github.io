// Created by Ali Zaghloul on 16/09/2026
/**
 * Projects: featured (sticky scene + scrolling story), the "more" grid,
 * and the full-screen case-study modal with hash deep links (#project/<id>).
 */
import { projects, featuredProjects, moreProjects } from '../../../data/projects.js';
import { $, $$, esc, prefersReducedMotion } from '../core/env.js';
import { initReveal } from '../core/reveal.js';
import { initTilt, initMagnetic } from './interactions.js';

const logoVars = (p) => `--logo-bg:${p.logoBg || '#fff'};--logo-pad:${p.logoPad || ''}`;
const ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';

/* ---------- Scene visuals: one variant per featured project ---------- */
function sceneMarkup(p, index) {
  const variant = index % 4;
  const tiles = (items, spread, n = 6) => items.slice(0, n).map((t, i) => {
    const [x, y] = spread[i];
    const anchor = x > 50 ? `right:${Math.max(4, 100 - x - 26)}%` : `left:${x}%`;
    return `<span class="feature__tile" style="${anchor};top:${y}%;--z:${20 + (i % 3) * 25}px;--d:${0.15 + i * 0.12}s">${esc(t)}</span>`;
  }).join('');
  const spreads = [
    [[6, 10], [64, 8], [4, 42], [70, 44], [10, 76], [58, 80]],
    [[8, 8], [62, 12], [6, 50], [66, 52], [20, 82], [60, 84]],
  ];
  if (variant === 0) {
    return `<div class="feature__orbit" style="width:64%;height:64%;--spd:28s"><i></i></div><div class="feature__orbit" style="width:88%;height:88%;--spd:46s;animation-direction:reverse"><i></i></div>${tiles(p.features, spreads[0])}`;
  }
  if (variant === 1) {
    const layers = p.architecture.layers.map((l, i) => `<span style="--i:${i}">${esc(l)}</span>`).join('');
    return `<div class="feature__stack">${layers}</div>${tiles(p.stack, spreads[1], 4).replace(/top:(\d+)%/g, (m, v) => `top:${Math.min(+v, 40)}%`)}`;
  }
  if (variant === 2) {
    return `<div class="feature__orbit" style="width:76%;height:76%;--spd:36s"><i></i></div>${tiles(p.features, spreads[1])}`;
  }
  return `<div class="feature__stack">${p.architecture.layers.map((l, i) => `<span style="--i:${i}">${esc(l)}</span>`).join('')}</div>${tiles(p.stack, spreads[0], 4).replace(/top:(\d+)%/g, (m, v) => `top:${Math.min(+v, 40)}%`)}`;
}

function featureMarkup(p, i) {
  const idx = String(i + 1).padStart(2, '0');
  const metrics = p.metrics.map((m) => `<div><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join('');
  const links = p.links.map((l) => `<a class="btn btn--sm" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ${ICON_ARROW.replace('<svg', '<svg class="btn__icon" width="14" height="14"')}</a>`).join('');
  const repo = p.repo ? `<a class="btn btn--sm btn--ghost" href="${esc(p.repo)}" target="_blank" rel="noopener">GitHub ${ICON_ARROW.replace('<svg', '<svg class="btn__icon" width="14" height="14"')}</a>` : '';
  return `
  <article class="feature" style="--p-accent:${p.accent};${logoVars(p)}" id="feature-${p.id}">
    <div class="feature__visual" data-reveal="${i % 2 ? 'right' : 'left'}">
      <div class="feature__scene tilt spotlight border-run" data-tilt="6" data-cursor="view" data-cursor-label="CASE STUDY" data-open="${p.id}" role="button" tabindex="0" aria-label="Open ${esc(p.name)} case study">
        <div class="feature__logo tilt__layer"><img src="${p.logo}" alt="" loading="lazy" width="120" height="120" /></div>
        ${sceneMarkup(p, i)}
        <span class="feature__caption">${esc(p.architecture.pattern)}</span>
        <span class="feature__cta" aria-hidden="true">${ICON_ARROW}</span>
      </div>
    </div>
    <div class="feature__body" data-stagger style="--stagger-step:90ms">
      <span class="feature__index">${idx} / ${String(featuredProjects.length).padStart(2, '0')} — ${esc(p.status)}</span>
      <h3 class="feature__title">${esc(p.name)}</h3>
      <p class="feature__tagline">${esc(p.tagline)}</p>
      <div class="feature__meta"><span class="badge badge--accent badge--dot" style="color:${p.accent};border-color:${p.accent}55;background:${p.accent}14">${esc(p.statusNote)}</span><span class="badge">${esc(p.period)}</span></div>
      <div class="feature__block"><h4>Problem</h4><p>${esc(p.problem)}</p></div>
      <div class="feature__block"><h4>Solution</h4><p>${esc(p.solution)}</p></div>
      <div class="feature__block"><h4>My role</h4><p>${esc(p.role)}</p></div>
      <div class="feature__block"><h4>Stack</h4><div class="row">${p.stack.slice(0, 9).map((s) => `<span class="badge">${esc(s)}</span>`).join('')}</div></div>
      ${metrics ? `<div class="feature__metrics">${metrics}</div>` : ''}
      <div class="feature__actions"><button class="btn btn--primary btn--sm" data-open="${p.id}" data-magnetic>Read case study</button>${links}${repo}</div>
    </div>
  </article>`;
}

function cardMarkup(p, i) {
  return `
  <div class="card pcard spotlight border-run" style="--p-accent:${p.accent};--i:${i};${logoVars(p)}" data-open="${p.id}" data-cursor="view" role="button" tabindex="0" aria-label="Open ${esc(p.name)} case study">
    <div class="pcard__head"><div class="pcard__logo"><img src="${p.logo}" alt="" loading="lazy" width="56" height="56" /></div><span class="pcard__arrow">${ICON_ARROW}</span></div>
    <div class="stack"><span class="pcard__status">${esc(p.status)} · ${esc(p.period)}</span><h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p></div>
    <div class="pcard__tags">${p.stack.slice(0, 5).map((s, j) => `<span class="badge" style="--i:${j}">${esc(s)}</span>`).join('')}</div>
  </div>`;
}

/* ---------- Case study modal ---------- */
function caseMarkup(p) {
  const list = (arr) => `<ul class="case__list">${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const section = (n, title, body) => body ? `<section class="case__section"><h3><small>${n}</small>${title}</h3>${body}</section>` : '';
  const flow = p.architecture.layers.map((l, i) => `<span>${esc(l)}</span>${i < p.architecture.layers.length - 1 ? '<i>→</i>' : ''}`).join('');
  const links = [
    ...p.links.map((l) => `<a class="btn btn--sm" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`),
    p.repo ? `<a class="btn btn--sm" href="${esc(p.repo)}" target="_blank" rel="noopener">GitHub repository</a>` : `<span class="badge">${esc(p.repoNote || 'Private repository')}</span>`,
  ].join('');
  return `
    <header class="case__hero">
      <div class="case__logo"><img src="${p.logo}" alt="${esc(p.name)} logo" width="84" height="84" /></div>
      <span class="eyebrow">${esc(p.status)} · ${esc(p.statusNote)}</span>
      <h2 id="modalTitle">${esc(p.name)}</h2>
      <p style="font-size:var(--fs-lg)">${esc(p.tagline)}</p>
      <div class="case__meta"><span><b>Role</b>${esc(p.role)}</span><span><b>Period</b>${esc(p.period)}</span></div>
      <div class="case__links">${links}</div>
    </header>
    ${section('01', 'Overview', `<p>${esc(p.summary)}</p>`)}
    <div class="case__two">
      ${section('02', 'The problem', p.problem ? `<p>${esc(p.problem)}</p>` : '')}
      ${section('03', 'The solution', p.solution ? `<p>${esc(p.solution)}</p>` : '')}
    </div>
    ${section('04', 'Architecture', `<div class="case__flow">${flow}</div><p><strong>${esc(p.architecture.pattern)}</strong>${p.architecture.notes ? ' — ' + esc(p.architecture.notes) : ''}</p>`)}
    ${section('05', 'Technology stack', `<div class="row">${p.stack.map((s) => `<span class="badge">${esc(s)}</span>`).join('')}</div>`)}
    <div class="case__two">
      ${section('06', 'Key features', list(p.features))}
      ${section('07', 'My role', list(p.myRole))}
    </div>
    ${p.challenges.length ? section('08', 'Challenges', list(p.challenges)) : ''}
    ${p.result ? section('09', 'Result', `<p>${esc(p.result)}</p>${p.metrics.length ? `<div class="case__metrics">${p.metrics.map((m) => `<div class="case__metric"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join('')}</div>` : ''}`) : ''}
  `;
}

let lastFocus = null;
function openProject(id, push = true) {
  const p = projects.find((x) => x.id === id);
  const modal = $('#modal');
  if (!p || !modal) return;
  lastFocus = document.activeElement;
  $('#modalContent').innerHTML = caseMarkup(p);
  $('#modalPanel').style.setProperty('--p-accent', p.accent);
  $('#modalPanel').style.setProperty('--logo-bg', p.logoBg || '#fff');
  $('#modalPanel').style.setProperty('--logo-pad', p.logoPad || '12px');
  $('#modalPanel').scrollTop = 0;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  if (push) history.pushState({ project: id }, '', `#project/${id}`);
  setTimeout(() => $('.modal__close')?.focus(), prefersReducedMotion ? 0 : 350);
}

function closeProject(pop = true) {
  const modal = $('#modal');
  if (!modal?.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
  if (pop && location.hash.startsWith('#project/')) history.pushState({}, '', location.pathname + location.search);
  lastFocus?.focus?.();
}

/* Focus trap inside the modal */
function trapFocus(e) {
  const modal = $('#modal');
  if (!modal.classList.contains('is-open') || e.key !== 'Tab') return;
  const f = $$('a[href], button, [tabindex]:not([tabindex="-1"])', modal).filter((el) => !el.disabled);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export function initProjects() {
  const featured = $('#featuredList');
  const grid = $('#projectsGrid');
  if (featured) featured.innerHTML = featuredProjects.map(featureMarkup).join('');
  if (grid) grid.innerHTML = moreProjects.map(cardMarkup).join('');

  initReveal(featured); initReveal(grid);
  initTilt(featured); initTilt(grid); initMagnetic(featured);

  /* Scene tile animation starts when visible */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { threshold: 0.3 });
    $$('.feature__scene').forEach((s) => io.observe(s));
  } else { $$('.feature__scene').forEach((s) => s.classList.add('is-visible')); }

  /* Open / close wiring */
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openProject(opener.dataset.open); return; }
    if (e.target.closest('[data-close]')) closeProject();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProject();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open][role="button"]')) { e.preventDefault(); openProject(e.target.dataset.open); }
    trapFocus(e);
  });
  window.addEventListener('popstate', () => {
    const m = location.hash.match(/^#project\/([\w-]+)/);
    if (m) openProject(m[1], false); else closeProject(false);
  });
  const m = location.hash.match(/^#project\/([\w-]+)/);
  if (m) openProject(m[1], false);
}

export { openProject };
