// Created by Ali Zaghloul on 16/09/2026
/**
 * Scroll reveal via IntersectionObserver.
 *  - [data-reveal="variant"]   single element, variant defined in motion.css
 *  - [data-stagger]            parent; children animate with --i delay
 *  - .split                    heading split into words for a mask reveal
 * Reduced motion: everything is shown immediately (CSS handles the rest).
 */
import { $$, prefersReducedMotion } from './env.js';

function splitWords(el) {
  if (el.dataset.split === 'done') return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  let i = 0;
  textNodes.forEach((node) => {
    if (!node.textContent.trim()) return;
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
      const w = document.createElement('span');
      w.className = 'w';
      const inner = document.createElement('span');
      inner.textContent = part;
      inner.style.setProperty('--i', i++);
      w.appendChild(inner);
      frag.appendChild(w);
    });
    node.replaceWith(frag);
  });
  el.dataset.split = 'done';
}

export function initReveal(root = document) {
  const splits = $$('.split', root);
  if (!prefersReducedMotion) splits.forEach(splitWords);

  const targets = [...$$('[data-reveal]', root), ...$$('[data-stagger]', root), ...splits];
  targets.forEach((el) => {
    if (el.hasAttribute('data-stagger')) {
      Array.from(el.children).forEach((c, i) => { if (!c.style.getPropertyValue('--i')) c.style.setProperty('--i', i); });
    }
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
  );
  targets.forEach((el) => io.observe(el));
  return io;
}

/** Observe one element and run a callback the first time it becomes visible. */
export function onceVisible(el, cb, options = { threshold: 0.3 }) {
  if (!el) return;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) { cb(el); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { cb(el); io.disconnect(); } });
  }, options);
  io.observe(el);
}
