// Created by Ali Zaghloul on 16/09/2026
/**
 * GitHub section — fetched live from the public API in the visitor's browser
 * (60 req/h unauthenticated). Falls back to a static snapshot when offline
 * or rate-limited, so the section never renders empty.
 */
import { site } from '../../../data/site.js';
import { $, $$, esc } from '../core/env.js';
import { onceVisible, initReveal } from '../core/reveal.js';

const FALLBACK = {
  profile: { name: 'Ali Zaghloul', login: site.githubUser, public_repos: 38, followers: 3, location: 'Riyadh, Saudi Arabia', avatar_url: 'assets/img/profile.jpg', html_url: site.github, created_at: '2019-05-11T00:00:00Z' },
  repos: [
    { name: 'QuranApp', description: 'Quran reading app in Swift — tafsir, translations, offline content.', language: 'Swift', html_url: 'https://github.com/alizaglool/QuranApp', stargazers_count: 0, pushed_at: '2026-06-09' },
    { name: 'tafsir-books', description: 'Quran tafsir & translation JSON files — content source for QuranApp.', language: null, html_url: 'https://github.com/alizaglool/tafsir-books', stargazers_count: 1, pushed_at: '2026-06-02' },
    { name: 'Swipy-ios', description: 'Swipy digital business cards — the production iOS app.', language: 'Swift', html_url: 'https://github.com/alizaglool/Swipy-ios', stargazers_count: 0, pushed_at: '2025-06-02' },
    { name: 'Mazaady-Portal', description: 'Auctions portal client in Swift — MVVM, typed API layer.', language: 'Swift', html_url: 'https://github.com/alizaglool/Mazaady-Portal', stargazers_count: 0, pushed_at: '2025-04-19' },
  ],
};

const LANG_COLORS = { Dart: '#00b4ab', HTML: '#e34c26', PHP: '#4f5d95', TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572a5', Kotlin: '#a97bff', Swift: '#f05138' };

async function fetchJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, signal: ctrl.signal });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } finally { clearTimeout(t); }
}

function render(layout, profile, repos, live) {
  const langs = {};
  repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
  const total = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
  const langRows = Object.entries(langs).sort((a, b) => b[1] - a[1]).map(([l, n]) => `
    <div class="gh__lang"><span>${esc(l)}</span><i><b data-w="${Math.round((n / total) * 100)}" style="background:${LANG_COLORS[l] || 'var(--accent)'}"></b></i><small>${Math.round((n / total) * 100)}%</small></div>`).join('');
  const since = new Date(profile.created_at).getFullYear();
  layout.innerHTML = `
    <aside class="card gh__profile" data-reveal="left">
      <header><img class="gh__avatar" src="${esc(profile.avatar_url)}" alt="" width="64" height="64" loading="lazy" /><div><h3>${esc(profile.name || profile.login)}</h3><span class="muted">@${esc(profile.login)} · ${esc(profile.location || '')}</span></div></header>
      <div class="gh__numbers"><div><b>${profile.public_repos}</b><span>public repos</span></div><div><b>${profile.followers}</b><span>followers</span></div><div><b>${since}</b><span>on GitHub since</span></div></div>
      <div class="gh__langs">${langRows}</div>
      <a class="btn btn--sm" href="${esc(profile.html_url)}" target="_blank" rel="noopener">Open GitHub profile</a>
      <small class="muted" style="font-size:.7rem">${live ? 'Live from the GitHub API' : 'Snapshot — GitHub API unavailable right now'}</small>
    </aside>
    <div class="gh__repos" data-stagger>
      ${repos.map((r, i) => `
        <a class="card repo" href="${esc(r.html_url)}" target="_blank" rel="noopener" style="--i:${i}">
          <h4>${esc(r.name)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></h4>
          <p>${esc(r.description || 'No description yet.')}</p>
          <footer><span><i style="background:${LANG_COLORS[r.language] || 'var(--text-3)'}"></i>${esc(r.language || '—')}</span><span>★ ${r.stargazers_count}</span><span>updated ${new Date(r.pushed_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span></footer>
        </a>`).join('')}
    </div>`;
  requestAnimationFrame(() => $$('[data-w]', layout).forEach((b) => { b.style.width = `${b.dataset.w}%`; }));
}

export function initGithub() {
  const layout = $('#ghLayout');
  if (!layout) return;
  /* Render the snapshot immediately so the section is never empty, then upgrade to live data. */
  render(layout, FALLBACK.profile, FALLBACK.repos, false);
  initReveal(layout);
  onceVisible(layout, async () => {
    try {
      const [profile, repos] = await Promise.all([
        fetchJson(`https://api.github.com/users/${site.githubUser}`),
        fetchJson(`https://api.github.com/users/${site.githubUser}/repos?per_page=100&sort=pushed`),
      ]);
      const own = repos.filter((r) => !r.fork).sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 8);
      render(layout, profile, own, true);
      initReveal(layout);
    } catch { /* keep snapshot */ }
  }, { threshold: 0.01, rootMargin: '600px 0px' });
}
