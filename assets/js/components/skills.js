// Created by Ali Zaghloul on 16/09/2026
/** Skills cloud: tabs per group, floating chips, hover → related projects. */
import { skillGroups } from '../../../data/skills.js';
import { projects } from '../../../data/projects.js';
import { $, $$, esc, prefersReducedMotion } from '../core/env.js';

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

function renderPanel(panel, skill) {
  if (!skill) {
    panel.innerHTML = `<span class="eyebrow">Related work</span><h3>Pick a technology</h3><p class="muted">Hover or tap a skill to see the projects it was used in.</p>`;
    return;
  }
  const related = skill.projects.map((id) => byId[id]).filter(Boolean);
  panel.innerHTML = `
    <span class="eyebrow">${esc(skill.level)} · ${related.length} project${related.length === 1 ? '' : 's'}</span>
    <h3>${esc(skill.name)}</h3>
    <div class="skills__related">${related.map((p) => `<a href="#project/${p.id}" data-open="${p.id}"><img src="${p.logo}" alt="" loading="lazy" width="26" height="26" /><span>${esc(p.name)}</span><span class="muted" style="margin-left:auto;font-size:.7rem">${esc(p.status)}</span></a>`).join('')}</div>`;
}

export function initSkills() {
  const tabs = $('#skillTabs');
  const cloud = $('#skillCloud');
  const panel = $('#skillPanel');
  if (!tabs || !cloud || !panel) return;

  const allGroup = { id: 'all', label: 'All', skills: skillGroups.flatMap((g) => g.skills) };
  const groups = [allGroup, ...skillGroups];

  tabs.innerHTML = groups.map((g, i) => `<button class="skills__tab" role="tab" aria-selected="${i === 0}" data-group="${g.id}" id="tab-${g.id}">${esc(g.label)}</button>`).join('');

  const renderCloud = (groupId) => {
    const g = groups.find((x) => x.id === groupId);
    cloud.classList.remove('has-focus');
    cloud.innerHTML = g.skills.map((s, i) => `
      <button class="skill" type="button" data-level="${s.level}" data-name="${esc(s.name)}" style="--d:${-(i % 7) * 0.9}s;--i:${i}" aria-describedby="skillPanel">
        <i aria-hidden="true"></i>${esc(s.name)}<small>${s.projects.length}</small>
      </button>`).join('');
    if (!prefersReducedMotion) {
      $$('.skill', cloud).forEach((el, i) => { el.style.opacity = 0; el.style.transform = 'translateY(14px)'; setTimeout(() => { el.style.transition = 'opacity .5s var(--ease-out), transform .6s var(--ease-out)'; el.style.opacity = ''; el.style.transform = ''; }, 30 + i * 35); });
    }
    renderPanel(panel, null);
  };
  renderCloud('all');

  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-group]');
    if (!b) return;
    $$('.skills__tab', tabs).forEach((t) => t.setAttribute('aria-selected', String(t === b)));
    renderCloud(b.dataset.group);
  });

  const find = (name) => allGroup.skills.find((s) => s.name === name);
  const focus = (el) => {
    $$('.skill', cloud).forEach((s) => s.classList.toggle('is-active', s === el));
    cloud.classList.add('has-focus');
    renderPanel(panel, find(el.dataset.name));
  };
  cloud.addEventListener('pointerover', (e) => { const s = e.target.closest('.skill'); if (s) focus(s); });
  cloud.addEventListener('focusin', (e) => { const s = e.target.closest('.skill'); if (s) focus(s); });
  cloud.addEventListener('click', (e) => { const s = e.target.closest('.skill'); if (s) focus(s); });
  cloud.addEventListener('pointerleave', () => { /* keep last selection so panel stays useful */ });
  /* [data-open] links in the panel are handled by the document-level listener in projects.js */
}
