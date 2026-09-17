// Created by Ali Zaghloul on 16/09/2026
/** Navigation: scroll state, sliding indicator, active section, progress, theme, mobile menu. */
import { $, $$, rafThrottle } from '../core/env.js';

export function initNav() {
  const nav = $('#nav');
  const links = $$('#navLinks a');
  const linksWrap = $('#navLinks');
  const indicator = $('.nav__indicator');
  const progress = $('#progressBar');
  const burger = $('#burger');
  const menu = $('#mobileMenu');
  const toggle = $('#themeToggle');

  /* Scroll state + progress bar */
  const onScroll = rafThrottle(() => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Sliding indicator follows hovered / active link */
  const moveIndicator = (el) => {
    if (!el || !indicator) return;
    const r = el.getBoundingClientRect();
    const p = linksWrap.getBoundingClientRect();
    indicator.style.width = `${r.width}px`;
    indicator.style.transform = `translateX(${r.left - p.left}px)`;
  };
  let active = null;
  links.forEach((a) => {
    a.addEventListener('mouseenter', () => moveIndicator(a));
  });
  linksWrap?.addEventListener('mouseleave', () => moveIndicator(active));

  /* Active section via IntersectionObserver */
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.classList.remove('is-active'));
          const a = links.find((l) => l.getAttribute('href') === `#${e.target.id}`);
          if (a) { a.classList.add('is-active'); active = a; linksWrap.classList.add('has-active'); moveIndicator(a); }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => io.observe(s));
  }
  window.addEventListener('resize', rafThrottle(() => moveIndicator(active)));

  /* Theme toggle */
  toggle?.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  });

  /* Mobile menu */
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('is-locked', open);
  };
  burger?.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
}
