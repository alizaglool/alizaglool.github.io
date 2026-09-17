// Created by Ali Zaghloul on 16/09/2026
/**
 * Entry point — boots modules in priority order.
 * Above-the-fold first (loader, nav, hero), then everything else.
 */
import { $ } from './core/env.js';
import { initReveal } from './core/reveal.js';
import { initLoader } from './components/loader.js';
import { initNav } from './components/nav.js';
import { initCursor } from './components/cursor.js';
import { initHero } from './components/hero.js';
import { initMagnetic, initTilt, initCopy } from './components/interactions.js';
import { initProjects } from './components/projects.js';
import { initSkills } from './components/skills.js';
import { initArchitecture } from './components/architecture.js';
import { initTimeline } from './components/timeline.js';
import { initStats } from './components/stats.js';
import { initGithub } from './components/github.js';
import { initContact } from './components/contact.js';
import { initTerminal } from './components/terminal.js';

const MARQUEE = ['Swift', 'UIKit', 'SwiftUI', 'Combine', 'RxSwift', 'MVVM', 'Core Data', 'Realm', 'Offline-first', 'SignalR', 'REST APIs', 'Firebase', 'POS Hardware', 'MapKit', 'Apple Pay · mada', 'Arabic RTL'];

function initMarquee() {
  const track = $('#marqueeTrack');
  if (!track) return;
  const items = MARQUEE.map((t) => `<span>${t}</span>`).join('');
  track.innerHTML = items + items; /* duplicated for a seamless loop */
}

async function boot() {
  const loading = initLoader();
  initNav();
  initMarquee();

  /* Render data-driven sections before reveal observers attach */
  initProjects();
  initSkills();
  initArchitecture();
  initTimeline();
  initStats();
  initGithub();
  initContact();
  initTerminal();

  initReveal(document);
  initMagnetic(document);
  initTilt(document);
  initCopy(document);
  initCursor();

  $('#year').textContent = new Date().getFullYear();

  await loading;
  initHero();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
